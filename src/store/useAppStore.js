import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
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
      setMusicUrl: (url) => set({ musicUrl: url }),

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
      setFocusDuration: (m) => set({ focusDuration: m }),
      setBreakDuration: (m) => set({ breakDuration: m }),
      setLongBreakDuration: (m) => set({ longBreakDuration: m }),
      setTimerState: (state) => set({ timerState: state }),
      incrementSessionCount: () => set((state) => ({ sessionCount: state.sessionCount + 1 })),

      // --- Tasks ---
      tasks: [], // { id, text, done, createdAt }
      addTask: (text) => set((state) => ({
        tasks: [...state.tasks, { id: crypto.randomUUID(), text, done: false, createdAt: Date.now() }]
      })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      reorderTasks: (tasks) => set({ tasks }),

      // --- Theme ---
      activeTheme: 'aurora-mesh',
      setTheme: (themeId) => set({ activeTheme: themeId }),
      setActiveTheme: (themeId) => set({ activeTheme: themeId }),

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
      recordSession: (minutes) => set((state) => {
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
      }),
      incrementTasksCompleted: () => set((state) => {
        const todayStr = new Date().toLocaleDateString();
        let currentStats = JSON.parse(JSON.stringify(state.stats));
        
        if (currentStats.today.date !== todayStr) {
          currentStats.history.push({ ...currentStats.today });
          currentStats.today = { date: todayStr, sessions: 0, focusMinutes: 0, tasksCompleted: 0 };
        }

        currentStats.today.tasksCompleted += 1;
        return { stats: currentStats };
      }),

      // --- Settings ---
      clockFormat: '12h',   // '12h' | '24h'
      quoteCategory: 'all', // 'all' | 'motivational' | 'gratitude' | 'self-care'
      alertSound: 'chime',
      setSetting: (key, val) => set({ [key]: val })
    }),
    {
      name: 'clariflo-storage',
      partialize: (state) => {
        const { timerState, activePanel, isAudioBlocked, resumeAudioIntent, ...rest } = state;
        return rest;
      }
    }
  )
)
