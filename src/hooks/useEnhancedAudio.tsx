
import { useEffect, useRef, useState, useCallback } from 'react';
import { Howl, Howler } from 'howler';

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
  const audioRefs = useRef<Map<string, Howl>>(new Map());
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
  }, []);

  const preloadMedicalAudio = useCallback((tracks: AudioTrack[]) => {
    tracks.forEach(track => {
      if (!audioRefs.current.has(track.id)) {
        const howl = new Howl({
          src: [track.src],
          volume: track.volume || (track.category === 'music' ? musicVolume : sfxVolume),
          loop: track.loop || false,
          preload: true,
          html5: track.category === 'music',
          onload: () => {
            console.log(`Medical audio loaded: ${track.id}`);
          },
          onloaderror: (id, error) => {
            console.error(`Failed to load medical audio ${track.id}:`, error);
          }
        });
        audioRefs.current.set(track.id, howl);
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
        setTimeout(() => document.body.removeChild(announcement), 1000);
      }

      if (options?.volume) {
        audio.volume(options.volume);
      }
      
      if (options?.fade) {
        audio.fade(0, audio.volume(), 1000);
      }

      // Spatial audio positioning (simulated for web audio)
      if (options?.spatialPosition) {
        const [x, y, z] = options.spatialPosition;
        audio.pos(x, y, z);
      }

      audio.play();
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
        id: 'heartbeat-monitor',
        src: '/audio/heartbeat.mp3',
        volume: Math.max(0.1, 0.4 - userStress * 0.3),
        loop: true,
        category: 'medical',
        medicalContext: 'diagnostic'
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
      volume: accessibilitySettings.reducedMotion ? track.volume! * 0.7 : track.volume
    }));

    preloadMedicalAudio(adjustedTracks);
    
    // Start ambient tracks
    playMedicalAudio('medical-ambient', {
      accessibleDescription: 'Medical learning environment audio started'
    });
    
    if (userStress < 0.7) {
      playMedicalAudio('heartbeat-monitor', {
        accessibleDescription: 'Patient monitoring sounds active'
      });
    }
  }, [preloadMedicalAudio, playMedicalAudio, accessibilitySettings.reducedMotion]);

  const stopMedicalAudio = useCallback((id: string, fade: boolean = true) => {
    const audio = audioRefs.current.get(id);
    if (audio) {
      if (fade && !accessibilitySettings.reducedMotion) {
        audio.fade(audio.volume(), 0, 1000);
        setTimeout(() => audio.stop(), 1000);
      } else {
        audio.stop();
      }
    }
  }, [accessibilitySettings.reducedMotion]);

  const toggleAudio = useCallback(() => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      Howler.mute(false);
    } else {
      Howler.mute(true);
    }
  }, [isEnabled]);

  const updateAccessibilitySettings = useCallback((settings: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings(prev => ({ ...prev, ...settings }));
  }, []);

  useEffect(() => {
    return () => {
      audioRefs.current.forEach(audio => {
        audio.unload();
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
