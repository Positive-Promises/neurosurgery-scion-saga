
import { useCallback, useEffect, useRef, useState } from 'react';

interface AudioTrack {
  id: string;
  src: string;
  category: 'music' | 'sfx' | 'voice' | 'ambient';
  loop?: boolean;
  volume?: number;
}

export const useAudioManager = () => {
  const audioElements = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [isMuted, setIsMuted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.7);

  const preloadAudio = useCallback((tracks: AudioTrack[]) => {
    tracks.forEach(track => {
      if (!audioElements.current.has(track.id)) {
        try {
          const audio = new Audio(track.src);
          audio.loop = track.loop || false;
          audio.volume = (track.volume || 0.5) * masterVolume;
          audio.preload = 'auto';
          
          audio.addEventListener('error', () => {
            console.warn(`Failed to load audio: ${track.id}`);
          });
          
          audioElements.current.set(track.id, audio);
        } catch (error) {
          console.warn(`Error creating audio element for ${track.id}:`, error);
        }
      }
    });
  }, [masterVolume]);

  const playAudio = useCallback((id: string) => {
    if (isMuted) return;
    
    const audio = audioElements.current.get(id);
    if (audio) {
      try {
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn(`Audio play failed for ${id}:`, error);
          });
        }
      } catch (error) {
        console.warn(`Error playing audio ${id}:`, error);
      }
    }
  }, [isMuted]);

  const stopAudio = useCallback((id: string, fadeOut: boolean = false) => {
    const audio = audioElements.current.get(id);
    if (audio) {
      if (fadeOut) {
        const fadeInterval = setInterval(() => {
          if (audio.volume > 0.1) {
            audio.volume -= 0.1;
          } else {
            audio.pause();
            audio.volume = (masterVolume * 0.5);
            clearInterval(fadeInterval);
          }
        }, 100);
      } else {
        audio.pause();
      }
    }
  }, [masterVolume]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      audioElements.current.forEach(audio => {
        audio.muted = newMuted;
      });
      return newMuted;
    });
  }, []);

  // Update volume for all audio elements when masterVolume changes
  useEffect(() => {
    audioElements.current.forEach(audio => {
      if (!audio.muted) {
        audio.volume = masterVolume * 0.5;
      }
    });
  }, [masterVolume]);

  return {
    preloadAudio,
    playAudio,
    stopAudio,
    toggleMute,
    isMuted,
    masterVolume,
    setMasterVolume
  };
};
