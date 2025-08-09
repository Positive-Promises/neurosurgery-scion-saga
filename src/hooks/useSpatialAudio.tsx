
import { useCallback, useEffect, useRef, useState } from 'react';
import { Vector3, Euler } from 'three';

interface SpatialAudioTrack {
  id: string;
  src: string;
  position: [number, number, number];
  volume?: number;
  loop?: boolean;
  category: 'medical' | 'ambient' | 'ui' | 'surgical';
  medicalContext?: string;
}

interface AudioListener {
  position: [number, number, number];
  rotation: [number, number, number];
}

interface WindowWithAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export const useSpatialAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const listenerRef = useRef<AudioListener>({ position: [0, 0, 0], rotation: [0, 0, 0] });
  const spatialNodes = useRef<Map<string, { 
    audio: HTMLAudioElement; 
    panner: PannerNode; 
    gainNode: GainNode; 
  }>>(new Map());
  const [isEnabled, setIsEnabled] = useState(true);
  const [masterVolume, setMasterVolume] = useState(0.7);

  // Initialize Web Audio API
  useEffect(() => {
    try {
      const TheAudioContext = window.AudioContext || (window as WindowWithAudioContext).webkitAudioContext;
      if (TheAudioContext) {
        audioContextRef.current = new TheAudioContext();
      } else {
        throw new Error('AudioContext not supported');
      }
      
      // Set up 3D audio listener
      const listener = audioContextRef.current.listener;
      if (listener.positionX) {
        listener.positionX.setValueAtTime(0, audioContextRef.current.currentTime);
        listener.positionY.setValueAtTime(0, audioContextRef.current.currentTime);
        listener.positionZ.setValueAtTime(0, audioContextRef.current.currentTime);
        listener.forwardX.setValueAtTime(0, audioContextRef.current.currentTime);
        listener.forwardY.setValueAtTime(0, audioContextRef.current.currentTime);
        listener.forwardZ.setValueAtTime(-1, audioContextRef.current.currentTime);
        listener.upX.setValueAtTime(0, audioContextRef.current.currentTime);
        listener.upY.setValueAtTime(1, audioContextRef.current.currentTime);
        listener.upZ.setValueAtTime(0, audioContextRef.current.currentTime);
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const preloadSpatialAudio = useCallback((tracks: SpatialAudioTrack[]) => {
    if (!audioContextRef.current) return;

    tracks.forEach(track => {
      if (!spatialNodes.current.has(track.id)) {
        try {
          const audio = new Audio(track.src);
          audio.crossOrigin = 'anonymous';
          audio.loop = track.loop || false;
          audio.volume = 0; // We'll control volume through gainNode

          // Create Web Audio nodes
          const source = audioContextRef.current!.createMediaElementSource(audio);
          const panner = audioContextRef.current!.createPanner();
          const gainNode = audioContextRef.current!.createGain();

          // Configure 3D panner
          panner.panningModel = 'HRTF';
          panner.distanceModel = 'inverse';
          panner.refDistance = 1;
          panner.maxDistance = 10;
          panner.rolloffFactor = 1;
          panner.coneInnerAngle = 360;
          panner.coneOuterAngle = 0;
          panner.coneOuterGain = 0;

          // Set initial position
          if (panner.positionX) {
            panner.positionX.setValueAtTime(track.position[0], audioContextRef.current!.currentTime);
            panner.positionY.setValueAtTime(track.position[1], audioContextRef.current!.currentTime);
            panner.positionZ.setValueAtTime(track.position[2], audioContextRef.current!.currentTime);
          }

          // Set volume
          gainNode.gain.setValueAtTime(
            (track.volume || 0.5) * masterVolume, 
            audioContextRef.current!.currentTime
          );

          // Connect nodes
          source.connect(gainNode);
          gainNode.connect(panner);
          panner.connect(audioContextRef.current!.destination);

          spatialNodes.current.set(track.id, { audio, panner, gainNode });

          // Preload audio
          audio.addEventListener('canplaythrough', () => {
            console.log(`Spatial audio loaded: ${track.id}`);
          });

          audio.addEventListener('error', (error) => {
            console.error(`Failed to load spatial audio ${track.id}:`, error);
          });

        } catch (error) {
          console.error(`Error creating spatial audio for ${track.id}:`, error);
        }
      }
    });
  }, [masterVolume]);

  const playSpatialAudio = useCallback((id: string, options?: {
    fadeIn?: boolean;
    position?: [number, number, number];
    medicalContext?: string;
  }) => {
    if (!isEnabled || !audioContextRef.current) return;

    const node = spatialNodes.current.get(id);
    if (node) {
      try {
        // Resume AudioContext if suspended
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }

        // Update position if provided
        if (options?.position && node.panner.positionX) {
          node.panner.positionX.setValueAtTime(
            options.position[0], 
            audioContextRef.current.currentTime
          );
          node.panner.positionY.setValueAtTime(
            options.position[1], 
            audioContextRef.current.currentTime
          );
          node.panner.positionZ.setValueAtTime(
            options.position[2], 
            audioContextRef.current.currentTime
          );
        }

        // Fade in effect
        if (options?.fadeIn) {
          node.gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
          node.gainNode.gain.linearRampToValueAtTime(
            masterVolume, 
            audioContextRef.current.currentTime + 1
          );
        }

        const playPromise = node.audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn(`Spatial audio play failed for ${id}:`, error);
          });
        }

      } catch (error) {
        console.warn(`Error playing spatial audio ${id}:`, error);
      }
    }
  }, [isEnabled, masterVolume]);

  const updateListenerPosition = useCallback((
    position: [number, number, number],
    rotation: [number, number, number]
  ) => {
    if (!audioContextRef.current) return;

    listenerRef.current = { position, rotation };
    
    const listener = audioContextRef.current.listener;
    if (listener.positionX) {
      listener.positionX.setValueAtTime(position[0], audioContextRef.current.currentTime);
      listener.positionY.setValueAtTime(position[1], audioContextRef.current.currentTime);
      listener.positionZ.setValueAtTime(position[2], audioContextRef.current.currentTime);

      // Calculate forward and up vectors from rotation
      const forward = new Vector3(0, 0, -1);
      const up = new Vector3(0, 1, 0);
      const euler = new Euler(rotation[0], rotation[1], rotation[2]);
      forward.applyEuler(euler);
      up.applyEuler(euler);

      listener.forwardX.setValueAtTime(forward.x, audioContextRef.current.currentTime);
      listener.forwardY.setValueAtTime(forward.y, audioContextRef.current.currentTime);
      listener.forwardZ.setValueAtTime(forward.z, audioContextRef.current.currentTime);
      listener.upX.setValueAtTime(up.x, audioContextRef.current.currentTime);
      listener.upY.setValueAtTime(up.y, audioContextRef.current.currentTime);
      listener.upZ.setValueAtTime(up.z, audioContextRef.current.currentTime);
    }
  }, []);

  const createMedicalSoundscape = useCallback((levelId: number) => {
    const medicalTracks: SpatialAudioTrack[] = [
      {
        id: 'operating-room-ambient',
        src: '/audio/or-ambient.mp3',
        position: [0, 0, 0],
        volume: 0.3,
        loop: true,
        category: 'ambient',
        medicalContext: 'surgical-environment'
      },
      {
        id: 'heart-monitor',
        src: '/audio/heart-monitor.mp3',
        position: [2, 1, -1],
        volume: 0.4,
        loop: true,
        category: 'medical',
        medicalContext: 'patient-monitoring'
      },
      {
        id: 'ventilator',
        src: '/audio/ventilator.mp3',
        position: [-2, 1, -1],
        volume: 0.3,
        loop: true,
        category: 'medical',
        medicalContext: 'life-support'
      },
      {
        id: 'surgical-suction',
        src: '/audio/suction.mp3',
        position: [1, 0, 1],
        volume: 0.5,
        category: 'surgical',
        medicalContext: 'surgical-tool'
      },
      {
        id: 'drill-sound',
        src: '/audio/drill.mp3',
        position: [-1, 0, 1],
        volume: 0.6,
        category: 'surgical',
        medicalContext: 'cranial-surgery'
      }
    ];

    preloadSpatialAudio(medicalTracks);

    // Start ambient tracks
    setTimeout(() => {
      playSpatialAudio('operating-room-ambient', { fadeIn: true });
      playSpatialAudio('heart-monitor', { fadeIn: true });
      if (levelId > 3) {
        playSpatialAudio('ventilator', { fadeIn: true });
      }
    }, 100);
  }, [preloadSpatialAudio, playSpatialAudio]);

  const stopSpatialAudio = useCallback((id: string, fadeOut: boolean = true) => {
    const node = spatialNodes.current.get(id);
    if (node && audioContextRef.current) {
      if (fadeOut) {
        node.gainNode.gain.linearRampToValueAtTime(
          0, 
          audioContextRef.current.currentTime + 1
        );
        setTimeout(() => {
          node.audio.pause();
          node.gainNode.gain.setValueAtTime(masterVolume, audioContextRef.current.currentTime);
        }, 1000);
      } else {
        node.audio.pause();
      }
    }
  }, [masterVolume]);

  const toggleSpatialAudio = useCallback(() => {
    setIsEnabled(prev => {
      const newState = !prev;
      spatialNodes.current.forEach(node => {
        node.audio.muted = !newState;
      });
      return newState;
    });
  }, []);

  return {
    preloadSpatialAudio,
    playSpatialAudio,
    stopSpatialAudio,
    updateListenerPosition,
    createMedicalSoundscape,
    toggleSpatialAudio,
    isEnabled,
    masterVolume,
    setMasterVolume
  };
};
