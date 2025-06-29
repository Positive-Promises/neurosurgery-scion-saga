
import { useEffect, useRef, useState, useCallback } from 'react';

// Simplified audio system to avoid Howler issues
interface AudioTrack {
  id: string;
  src: string;
  volume?: number;
  loop?: boolean;
  category: 'music' | 'sfx' | 'ambient' | 'voice' | 'medical';
  spatialPosition?: [number, number, number];
  medicalContext?: 'surgical' | 'diagnostic' | 'emergency' | 'learning';
}

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  subtitles: boolean;
  audioDescriptions: boolean;
}

export const useEnhancedAudio = () => {
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [isEnabled, setIsEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.6);
  const [sfxVolume, setSfxVolume] = useState(0.8);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
    subtitles: false,
    audioDescriptions: false
  });

  // Initialize accessibility settings from system preferences
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      
      setAccessibilitySettings(prev => ({
        ...prev,
        reducedMotion: mediaQuery.matches,
        highContrast: highContrastQuery.matches,
        screenReader: !!navigator.userAgent.match(/JAWS|NVDA|SAPI|VoiceOver|Window-Eyes|Dragon/i)
      }));

      const handleMotionChange = (e: MediaQueryListEvent) => {
        setAccessibilitySettings(prev => ({ ...prev, reducedMotion: e.matches }));
      };

      const handleContrastChange = (e: MediaQueryListEvent) => {
        setAccessibilitySettings(prev => ({ ...prev, highContrast: e.matches }));
      };

      mediaQuery.addEventListener('change', handleMotionChange);
      highContrastQuery.addEventListener('change', handleContrastChange);

      return () => {
        mediaQuery.removeEventListener('change', handleMotionChange);
        highContrastQuery.removeEventListener('change', handleContrastChange);
      };
    } catch (error) {
      console.warn('Failed to initialize accessibility settings:', error);
    }
  }, []);

  const preloadMedicalAudio = useCallback((tracks: AudioTrack[]) => {
    tracks.forEach(track => {
      if (!audioRefs.current.has(track.id)) {
        try {
          const audio = new Audio();
          audio.src = track.src;
          audio.volume = track.volume || (track.category === 'music' ? musicVolume : sfxVolume);
          audio.loop = track.loop || false;
          audio.preload = 'auto';
          
          audio.addEventListener('loadeddata', () => {
            console.log(`Medical audio loaded: ${track.id}`);
          });
          
          audio.addEventListener('error', (error) => {
            console.error(`Failed to load medical audio ${track.id}:`, error);
          });
          
          audioRefs.current.set(track.id, audio);
        } catch (error) {
          console.error(`Error creating audio for ${track.id}:`, error);
        }
      }
    });
  }, [musicVolume, sfxVolume]);

  const playMedicalAudio = useCallback((id: string, options?: {
    volume?: number;
    fade?: boolean;
    spatialPosition?: [number, number, number];
    medicalContext?: string;
    accessibleDescription?: string;
  }) => {
    if (!isEnabled) return;
    
    try {
      const audio = audioRefs.current.get(id);
      if (audio) {
        // Announce to screen readers if description provided
        if (options?.accessibleDescription && accessibilitySettings.screenReader) {
          const announcement = document.createElement('div');
          announcement.setAttribute('aria-live', 'polite');
          announcement.setAttribute('aria-atomic', 'true');
          announcement.textContent = options.accessibleDescription;
          announcement.style.position = 'absolute';
          announcement.style.left = '-9999px';
          document.body.appendChild(announcement);
          setTimeout(() => {
            if (document.body.contains(announcement)) {
              document.body.removeChild(announcement);
            }
          }, 1000);
        }

        if (options?.volume !== undefined) {
          audio.volume = Math.max(0, Math.min(1, options.volume));
        }

        // Reset audio to beginning and play
        audio.currentTime = 0;
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn(`Audio play failed for ${id}:`, error);
          });
        }
      }
    } catch (error) {
      console.warn(`Error playing audio ${id}:`, error);
    }
  }, [isEnabled, accessibilitySettings.screenReader]);

  const createMedicalSoundscape = useCallback((gameType: string, userStress: number = 0) => {
    const baseTracks: AudioTrack[] = [
      {
        id: 'medical-ambient',
        src: '/audio/medical-ambient.mp3',
        volume: 0.3,
        loop: true,
        category: 'ambient',
        medicalContext: 'learning'
      },
      {
        id: 'success-chime',
        src: '/audio/success.mp3',
        volume: 0.7,
        category: 'sfx',
        medicalContext: 'learning'
      },
      {
        id: 'error-tone',
        src: '/audio/error.mp3',
        volume: 0.6,
        category: 'sfx',
        medicalContext: 'learning'
      }
    ];

    // Adjust audio based on stress level and accessibility needs
    const adjustedTracks = baseTracks.map(track => ({
      ...track,
      volume: accessibilitySettings.reducedMotion ? (track.volume || 0.5) * 0.7 : track.volume
    }));

    preloadMedicalAudio(adjustedTracks);
    
    // Start ambient tracks
    setTimeout(() => {
      playMedicalAudio('medical-ambient', {
        accessibleDescription: 'Medical learning environment audio started'
      });
    }, 100);
  }, [preloadMedicalAudio, playMedicalAudio, accessibilitySettings.reducedMotion]);

  const stopMedicalAudio = useCallback((id: string, fade: boolean = true) => {
    try {
      const audio = audioRefs.current.get(id);
      if (audio) {
        if (fade && !accessibilitySettings.reducedMotion) {
          // Simple fade out
          const fadeInterval = setInterval(() => {
            if (audio.volume > 0.1) {
              audio.volume = Math.max(0, audio.volume - 0.1);
            } else {
              audio.pause();
              audio.volume = 1;
              clearInterval(fadeInterval);
            }
          }, 100);
        } else {
          audio.pause();
        }
      }
    } catch (error) {
      console.warn(`Error stopping audio ${id}:`, error);
    }
  }, [accessibilitySettings.reducedMotion]);

  const toggleAudio = useCallback(() => {
    setIsEnabled(prev => {
      const newState = !prev;
      // Mute/unmute all audio elements
      audioRefs.current.forEach(audio => {
        audio.muted = !newState;
      });
      return newState;
    });
  }, []);

  const updateAccessibilitySettings = useCallback((settings: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings(prev => ({ ...prev, ...settings }));
  }, []);

  // Update volume for existing audio elements
  useEffect(() => {
    audioRefs.current.forEach((audio, id) => {
      if (audio && !audio.paused) {
        const track = id.includes('music') ? musicVolume : sfxVolume;
        audio.volume = track;
      }
    });
  }, [musicVolume, sfxVolume]);

  useEffect(() => {
    return () => {
      audioRefs.current.forEach(audio => {
        try {
          audio.pause();
          audio.src = '';
        } catch (error) {
          console.warn('Error cleaning up audio:', error);
        }
      });
      audioRefs.current.clear();
    };
  }, []);

  return {
    preloadMedicalAudio,
    playMedicalAudio,
    stopMedicalAudio,
    createMedicalSoundscape,
    toggleAudio,
    isEnabled,
    musicVolume,
    sfxVolume,
    setMusicVolume,
    setSfxVolume,
    accessibilitySettings,
    updateAccessibilitySettings
  };
};
