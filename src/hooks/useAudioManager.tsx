
import { useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';

interface AudioTrack {
  id: string;
  src: string;
  volume?: number;
  loop?: boolean;
  category: 'music' | 'sfx' | 'ambient' | 'voice';
}

export const useAudioManager = () => {
  const audioRefs = useRef<Map<string, Howl>>(new Map());
  const [isEnabled, setIsEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.6);
  const [sfxVolume, setSfxVolume] = useState(0.8);

  // Preload essential audio tracks
  const preloadAudio = (tracks: AudioTrack[]) => {
    tracks.forEach(track => {
      if (!audioRefs.current.has(track.id)) {
        const howl = new Howl({
          src: [track.src],
          volume: track.volume || (track.category === 'music' ? musicVolume : sfxVolume),
          loop: track.loop || false,
          preload: true,
          html5: track.category === 'music' // Use HTML5 for music to save memory
        });
        audioRefs.current.set(track.id, howl);
      }
    });
  };

  const playAudio = (id: string, options?: { volume?: number; fade?: boolean }) => {
    if (!isEnabled) return;
    
    const audio = audioRefs.current.get(id);
    if (audio) {
      if (options?.volume) {
        audio.volume(options.volume);
      }
      if (options?.fade) {
        audio.fade(0, audio.volume(), 1000);
      }
      audio.play();
    }
  };

  const stopAudio = (id: string, fade?: boolean) => {
    const audio = audioRefs.current.get(id);
    if (audio) {
      if (fade) {
        audio.fade(audio.volume(), 0, 1000);
        setTimeout(() => audio.stop(), 1000);
      } else {
        audio.stop();
      }
    }
  };

  const pauseAudio = (id: string) => {
    const audio = audioRefs.current.get(id);
    if (audio) {
      audio.pause();
    }
  };

  const setGlobalVolume = (category: 'music' | 'sfx', volume: number) => {
    if (category === 'music') {
      setMusicVolume(volume);
      Howler.volume(volume);
    } else {
      setSfxVolume(volume);
    }
    
    // Update existing audio volumes
    audioRefs.current.forEach((audio, id) => {
      // This is a simplified approach - in production, you'd track categories per audio
      audio.volume(volume);
    });
  };

  const toggleAudio = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      Howler.mute(false);
    } else {
      Howler.mute(true);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      audioRefs.current.forEach(audio => {
        audio.unload();
      });
      audioRefs.current.clear();
    };
  }, []);

  return {
    preloadAudio,
    playAudio,
    stopAudio,
    pauseAudio,
    setGlobalVolume,
    toggleAudio,
    isEnabled,
    musicVolume,
    sfxVolume
  };
};
