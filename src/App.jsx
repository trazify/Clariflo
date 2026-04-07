import React from 'react';
import { useAppStore } from './store/useAppStore';
import { BackgroundLayer } from './components/layout/BackgroundLayer';
import { TopBar } from './components/layout/TopBar';
import { BottomModeToggle } from './components/layout/BottomModeToggle';
import { LeftWidgetBar } from './components/layout/LeftWidgetBar';
import { useSoundscape } from './hooks/useSoundscape';
import { HomeMode } from './components/modes/HomeMode';
import { FocusMode } from './components/modes/FocusMode';
import { AmbientMode } from './components/modes/AmbientMode';
import { TaskPanel } from './components/panels/TaskPanel';
import { SoundscapePanel } from './components/panels/SoundscapePanel';
import { MusicPanel } from './components/panels/MusicPanel';
import { ThemePanel } from './components/panels/ThemePanel';
import { StatsPanel } from './components/panels/StatsPanel';
import { SettingsPanel } from './components/panels/SettingsPanel';

function App() {
  const activeMode = useAppStore(state => state.activeMode);
  
  useSoundscape();

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white bg-black" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <BackgroundLayer />
      <TopBar />
      
      <main className="relative z-30 flex items-center justify-center w-full h-full">
        {activeMode === 'home' && <HomeMode />}
        {activeMode === 'focus' && <FocusMode />}
        {activeMode === 'ambient' && (
          <div className="w-full h-full p-6 pt-16">
            <AmbientMode />
          </div>
        )}
      </main>

      <LeftWidgetBar />
      <BottomModeToggle />

      <TaskPanel />
      <SoundscapePanel />
      <MusicPanel />
      <ThemePanel />
      <StatsPanel />
      <SettingsPanel />
    </div>
  );
}

export default App;
