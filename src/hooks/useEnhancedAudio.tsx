
import { useCallback, useEffect, useRef, useState } from 'react';

interface EnhancedAudioOptions {
  enableSpatialAudio?: boolean;
  enableDynamicRange?: boolean;
  enableReverb?: boolean;
  medicalContext?: string;
}

interface WindowWithAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export const useEnhancedAudio = (options: EnhancedAudioOptions = {}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [audioNodes, setAudioNodes] = useState<Map<string, AudioNode>>(new Map());

  useEffect(() => {
    try {
      const TheAudioContext = window.AudioContext || (window as WindowWithAudioContext).webkitAudioContext;
      if (TheAudioContext) {
        audioContextRef.current = new TheAudioContext();
        setIsInitialized(true);
      } else {
        throw new Error('AudioContext not supported');
      }
    } catch (error) {
      console.warn('Enhanced audio not supported:', error);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const createEnhancedAudioNode = useCallback((audioElement: HTMLAudioElement, id: string) => {
    if (!audioContextRef.current || !isInitialized) return null;

    try {
      const source = audioContextRef.current.createMediaElementSource(audioElement);
      const gainNode = audioContextRef.current.createGain();
      
      // Add medical-specific audio processing
      if (options.medicalContext) {
        const compressor = audioContextRef.current.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-24, audioContextRef.current.currentTime);
        compressor.knee.setValueAtTime(30, audioContextRef.current.currentTime);
        compressor.ratio.setValueAtTime(12, audioContextRef.current.currentTime);
        compressor.attack.setValueAtTime(0.003, audioContextRef.current.currentTime);
        compressor.release.setValueAtTime(0.25, audioContextRef.current.currentTime);
        
        source.connect(compressor);
        compressor.connect(gainNode);
      } else {
        source.connect(gainNode);
      }
      
      gainNode.connect(audioContextRef.current.destination);
      
      setAudioNodes(prev => new Map(prev.set(id, gainNode)));
      
      return gainNode;
    } catch (error) {
      console.warn(`Failed to create enhanced audio node for ${id}:`, error);
      return null;
    }
  }, [isInitialized, options.medicalContext]);

  const setAudioVolume = useCallback((id: string, volume: number) => {
    const node = audioNodes.get(id);
    if (node && audioContextRef.current && 'gain' in node) {
      (node as GainNode).gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    }
  }, [audioNodes]);

  return {
    isEnhancedAudioSupported: isInitialized,
    createEnhancedAudioNode,
    setAudioVolume,
    audioContext: audioContextRef.current
  };
};
