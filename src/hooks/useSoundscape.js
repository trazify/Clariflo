import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { useAppStore } from '../store/useAppStore';
import { soundPacks } from '../data/sounds';

export const useSoundscape = () => {
  const { activeSounds, setAudioBlocked, resumeAudioIntent } = useAppStore();
  const howlsRef = useRef({});

  // 1. Listen to explicit resume triggers from TopBar
  useEffect(() => {
    if (resumeAudioIntent > 0) {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume().then(() => {
          setAudioBlocked(false);
          Object.values(howlsRef.current).forEach(({ howl }) => {
            if (!howl.playing()) howl.play();
          });
        });
      } else {
        setAudioBlocked(false);
        Object.values(howlsRef.current).forEach(({ howl }) => {
          if (!howl.playing()) howl.play();
        });
      }
    }
  }, [resumeAudioIntent, setAudioBlocked]);

  // 2. React to activeSounds state changes (Crossfade Logic)
  useEffect(() => {
    // If we have active sounds but Howler Context is suspended, flag it
    if (Howler.ctx && Howler.ctx.state === 'suspended' && Object.values(activeSounds).some(x => x !== null)) {
      setAudioBlocked(true);
    }

    Object.keys(activeSounds).forEach(category => {
      const activeSoundSpec = activeSounds[category];
      const currentObj = howlsRef.current[category];

      // Category turned off
      if (!activeSoundSpec) {
        if (currentObj) {
          const oldHowl = currentObj.howl;
          oldHowl.fade(oldHowl.volume(), 0, 300);
          setTimeout(() => {
            oldHowl.stop();
            oldHowl.unload();
          }, 350);
          delete howlsRef.current[category];
        }
        return;
      }

      // Validate the sound exists in our packs
      const soundData = soundPacks.find(p => p.category === category)?.sounds.find(s => s.id === activeSoundSpec.id);
      if (!soundData) return;

      if (!currentObj || currentObj.file !== soundData.file) {
        // Fade out old sound if present
        if (currentObj) {
          const oldHowl = currentObj.howl;
          oldHowl.fade(oldHowl.volume(), 0, 300);
          setTimeout(() => { 
            oldHowl.stop(); 
            oldHowl.unload(); 
          }, 350);
        }

        // Create new Howl instance
        const newHowl = new Howl({
          src: [soundData.file],
          loop: true,
          volume: 0,
          html5: true,
          preload: true,
          onloaderror: function(id, err) {
            console.warn(`Failed to load sound: ${soundData.file}`, err);
            // Don't leave a zombie entry
            delete howlsRef.current[category];
          },
          onplayerror: function() {
            setAudioBlocked(true);
            newHowl.once('unlock', function() {
              setAudioBlocked(false);
              newHowl.play();
            });
          },
          onplay: function() {
            // Successfully playing - fade in
            newHowl.fade(0, activeSoundSpec.volume, 300);
          }
        });

        howlsRef.current[category] = { howl: newHowl, file: soundData.file };
        newHowl.play();

      } else {
        // Just update volume for an already-playing sound
        currentObj.howl.volume(activeSoundSpec.volume);
      }
    });
  }, [activeSounds, setAudioBlocked]);

  // 3. Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(howlsRef.current).forEach(({ howl }) => {
        howl.stop();
        howl.unload();
      });
      howlsRef.current = {};
    };
  }, []);

  return null;
};
