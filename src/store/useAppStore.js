import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  apiLogin, apiRegister, apiLogout, isLoggedIn,
  apiFetchTasks, apiCreateTask, apiUpdateTask, apiDeleteTask, apiReorderTasks,
  apiFetchStats, apiRecordSession, apiRecordTaskCompleted,
  apiFetchSettings, apiUpdateSettings
} from '../services/api'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // --- Auth ---
      isAuthenticated: isLoggedIn(),
      authUser: null,
      authError: null,
      authLoading: false,

      login: async (username, password) => {
        set({ authLoading: true, authError: null });
        try {
          const data = await apiLogin(username, password);
          set({
            isAuthenticated: true,
            authUser: data.user,
            userName: data.user.username,
            authLoading: false
          });
          // Load user data from backend
          get().loadUserData(data.user.settings);
        } catch (err) {
          set({ authError: err.message, authLoading: false });
        }
      },

      register: async (username, password) => {
        set({ authLoading: true, authError: null });
        try {
          const data = await apiRegister(username, password);
          set({
            isAuthenticated: true,
            authUser: data.user,
            userName: data.user.username,
            authLoading: false
          });
          get().loadUserData(data.user.settings);
        } catch (err) {
          set({ authError: err.message, authLoading: false });
        }
      },

      logout: () => {
        apiLogout();
        set({
          isAuthenticated: false,
          authUser: null,
          tasks: [],
          stats: {
            today: { date: new Date().toLocaleDateString(), sessions: 0, focusMinutes: 0, tasksCompleted: 0 },
            history: []
          }
        });
      },

      loadUserData: async (settingsFromAuth) => {
        try {
          // Apply settings from auth response or fetch them
          const settings = settingsFromAuth || (await apiFetchSettings())?.settings;
          if (settings) {
            set({
              activeTheme: settings.activeTheme || 'aurora-mesh',
              clockFormat: settings.clockFormat || '12h',
              quoteCategory: settings.quoteCategory || 'all',
              alertSound: settings.alertSound || 'chime',
              focusDuration: settings.focusDuration || 25,
              breakDuration: settings.breakDuration || 5,
              longBreakDuration: settings.longBreakDuration || 15,
              musicUrl: settings.musicUrl || ''
            });
          }

          // Fetch tasks
          const tasks = await apiFetchTasks();
          if (tasks && Array.isArray(tasks)) {
            set({
              tasks: tasks.map(t => ({
                id: t._id,
                text: t.text,
                done: t.done,
                createdAt: new Date(t.createdAt).getTime()
              }))
            });
          }

          // Fetch stats
          const statsData = await apiFetchStats();
          if (statsData && Array.isArray(statsData)) {
            const todayStr = new Date().toLocaleDateString();
            const todayStat = statsData.find(s => s.date === todayStr);
            const history = statsData.filter(s => s.date !== todayStr).map(s => ({
              date: s.date,
              sessions: s.sessions,
              focusMinutes: s.focusMinutes,
              tasksCompleted: s.tasksCompleted
            }));

            set({
              stats: {
                today: todayStat
                  ? { date: todayStat.date, sessions: todayStat.sessions, focusMinutes: todayStat.focusMinutes, tasksCompleted: todayStat.tasksCompleted }
                  : { date: todayStr, sessions: 0, focusMinutes: 0, tasksCompleted: 0 },
                history
              }
            });
          }
        } catch (err) {
          console.error('Failed to load user data:', err);
        }
      },

      // --- Mode ---
      activeMode: 'home', // 'home' | 'focus' | 'ambient'
      setMode: (mode) => set({ activeMode: mode }),

      // --- UI Panels ---
      activePanel: null,
      setActivePanel: (panel) => set({ activePanel: panel }),

      // --- Audio State ---
      isAudioBlocked: false,
      setAudioBlocked: (blocked) => set({ isAudioBlocked: blocked }),
      resumeAudioIntent: 0,
      triggerResumeAudio: () => set((state) => ({ resumeAudioIntent: state.resumeAudioIntent + 1 })),

      // --- Music URL ---
      musicUrl: '',
      setMusicUrl: (url) => {
        set({ musicUrl: url });
        if (get().isAuthenticated) {
          apiUpdateSettings({ musicUrl: url }).catch(console.error);
        }
      },

      // --- User ---
      userName: '',
      setUserName: (name) => set({ userName: name }),

      // --- Timer ---
      timerMode: 'pomodoro', // 'pomodoro' | 'countdown' | 'stopwatch'
      focusDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      timerState: 'idle', // 'idle' | 'running' | 'paused' | 'break'
      sessionCount: 0,
      setTimerMode: (mode) => set({ timerMode: mode }),
      setFocusDuration: (m) => {
        set({ focusDuration: m });
        if (get().isAuthenticated) {
          apiUpdateSettings({ focusDuration: m }).catch(console.error);
        }
      },
      setBreakDuration: (m) => {
        set({ breakDuration: m });
        if (get().isAuthenticated) {
          apiUpdateSettings({ breakDuration: m }).catch(console.error);
        }
      },
      setLongBreakDuration: (m) => {
        set({ longBreakDuration: m });
        if (get().isAuthenticated) {
          apiUpdateSettings({ longBreakDuration: m }).catch(console.error);
        }
      },
      setTimerState: (state) => set({ timerState: state }),
      incrementSessionCount: () => set((state) => ({ sessionCount: state.sessionCount + 1 })),

      // --- Tasks ---
      tasks: [], // { id, text, done, createdAt }
      addTask: async (text) => {
        const tempId = crypto.randomUUID();
        const newTask = { id: tempId, text, done: false, createdAt: Date.now() };

        // Optimistic update
        set((state) => ({ tasks: [...state.tasks, newTask] }));

        // Sync to backend
        if (get().isAuthenticated) {
          try {
            const created = await apiCreateTask(text);
            if (created) {
              // Replace temp ID with server ID
              set((state) => ({
                tasks: state.tasks.map(t =>
                  t.id === tempId ? { ...t, id: created._id } : t
                )
              }));
            }
          } catch (err) {
            console.error('Failed to create task on server:', err);
          }
        }
      },
      toggleTask: async (id) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;

        // Optimistic update
        set((state) => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
        }));

        // Sync to backend
        if (get().isAuthenticated) {
          apiUpdateTask(id, { done: !task.done }).catch(console.error);
        }
      },
      deleteTask: async (id) => {
        // Optimistic update
        set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) }));

        // Sync to backend
        if (get().isAuthenticated) {
          apiDeleteTask(id).catch(console.error);
        }
      },
      reorderTasks: async (tasks) => {
        set({ tasks });

        // Sync to backend
        if (get().isAuthenticated) {
          const ordered = tasks.map((t, i) => ({ id: t.id, order: i }));
          apiReorderTasks(ordered).catch(console.error);
        }
      },

      // --- Theme ---
      activeTheme: 'aurora-mesh',
      setTheme: (themeId) => {
        set({ activeTheme: themeId });
        if (get().isAuthenticated) {
          apiUpdateSettings({ activeTheme: themeId }).catch(console.error);
        }
      },
      setActiveTheme: (themeId) => {
        set({ activeTheme: themeId });
        if (get().isAuthenticated) {
          apiUpdateSettings({ activeTheme: themeId }).catch(console.error);
        }
      },

      // --- Soundscape ---
      activeSounds: {
        'Rain': null,
        'Fire': null,
        'Café': null,
        'Focus': null,
        'Nature': null,
      },
      setSoundVolume: (category, volume) => set((state) => {
        const current = state.activeSounds[category];
        if (!current) return state;
        return {
          activeSounds: {
            ...state.activeSounds,
            [category]: { ...current, volume }
          }
        };
      }),
      toggleSound: (category, soundId) => set((state) => {
        const current = state.activeSounds[category];
        // If clicking the same sound pill that is active, turn it off
        if (current?.id === soundId) {
          return {
            activeSounds: {
              ...state.activeSounds,
              [category]: null
            }
          };
        }
        // Otherwise, switch to the new sound, keeping current category volume (or default 0.5)
        return {
          activeSounds: {
            ...state.activeSounds,
            [category]: { id: soundId, volume: current ? current.volume : 0.5 }
          }
        };
      }),
      turnOffCategory: (category) => set((state) => ({
        activeSounds: {
          ...state.activeSounds,
          [category]: null
        }
      })),

      // --- Stats ---
      stats: {
        today: { date: new Date().toLocaleDateString(), sessions: 0, focusMinutes: 0, tasksCompleted: 0 },
        history: [] // [{ date, sessions, focusMinutes, tasksCompleted }]
      },
      recordSession: (minutes) => {
        set((state) => {
          const todayStr = new Date().toLocaleDateString();
          let currentStats = JSON.parse(JSON.stringify(state.stats));
          
          // If it's a new day, push yesterday to history and reset today
          if (currentStats.today.date !== todayStr) {
            currentStats.history.push({ ...currentStats.today });
            currentStats.today = { date: todayStr, sessions: 0, focusMinutes: 0, tasksCompleted: 0 };
          }

          currentStats.today.sessions += 1;
          currentStats.today.focusMinutes += minutes;

          return { stats: currentStats };
        });

        // Sync to backend
        if (get().isAuthenticated) {
          apiRecordSession(minutes).catch(console.error);
        }
      },
      incrementTasksCompleted: () => {
        set((state) => {
          const todayStr = new Date().toLocaleDateString();
          let currentStats = JSON.parse(JSON.stringify(state.stats));
          
          if (currentStats.today.date !== todayStr) {
            currentStats.history.push({ ...currentStats.today });
            currentStats.today = { date: todayStr, sessions: 0, focusMinutes: 0, tasksCompleted: 0 };
          }

          currentStats.today.tasksCompleted += 1;
          return { stats: currentStats };
        });

        // Sync to backend
        if (get().isAuthenticated) {
          apiRecordTaskCompleted().catch(console.error);
        }
      },

      // --- Settings ---
      clockFormat: '12h',   // '12h' | '24h'
      quoteCategory: 'all', // 'all' | 'motivational' | 'gratitude' | 'self-care'
      alertSound: 'chime',
      setSetting: (key, val) => {
        set({ [key]: val });
        // Sync settings that are stored on the backend
        const syncableSettings = ['clockFormat', 'quoteCategory', 'alertSound'];
        if (get().isAuthenticated && syncableSettings.includes(key)) {
          apiUpdateSettings({ [key]: val }).catch(console.error);
        }
      }
    }),
    {
      name: 'clariflo-storage',
      partialize: (state) => {
        const { timerState, activePanel, isAudioBlocked, resumeAudioIntent, authLoading, authError, ...rest } = state;
        return rest;
      }
    }
  )
)
