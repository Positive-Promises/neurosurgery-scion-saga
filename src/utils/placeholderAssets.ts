
// Placeholder assets for development when real assets aren't available

export const generatePlaceholderAudio = (id: string, category: string): string => {
  // In a real implementation, this would return actual audio file paths
  // For now, we'll use data URLs or fallback to silence
  const placeholderAudioMap: Record<string, string> = {
    'surgical-ambient': '/audio/placeholder-ambient.mp3',
    'success': '/audio/placeholder-success.mp3',
    'error': '/audio/placeholder-error.mp3',
    'heart-monitor': '/audio/placeholder-heartbeat.mp3',
    'ventilator': '/audio/placeholder-ventilator.mp3',
    'or-ambient': '/audio/placeholder-or-ambient.mp3',
    'suction': '/audio/placeholder-suction.mp3',
    'drill': '/audio/placeholder-drill.mp3'
  };

  return placeholderAudioMap[id] || '/audio/placeholder-silence.mp3';
};

export const generatePlaceholderModel = (levelId: number): string => {
  const modelMap: Record<number, string> = {
    1: '/models/placeholder-brain.glb',
    2: '/models/placeholder-spine.glb',
    3: '/models/placeholder-nervous-system.glb',
    4: '/models/placeholder-instruments.glb',
    5: '/models/placeholder-brain-pathology.glb',
    6: '/models/placeholder-spinal-cord.glb',
    7: '/models/placeholder-cranial-nerves.glb',
    8: '/models/placeholder-cerebrovascular.glb',
    9: '/models/placeholder-tumor-models.glb',
    10: '/models/placeholder-complex-cases.glb'
  };

  return modelMap[levelId] || '/models/placeholder-default.glb';
};

export const generatePlaceholderTexture = (type: 'normal' | 'roughness' | 'diffuse'): string => {
  const textureMap: Record<string, string> = {
    'normal': '/textures/placeholder-normal.jpg',
    'roughness': '/textures/placeholder-roughness.jpg',
    'diffuse': '/textures/placeholder-diffuse.jpg'
  };

  return textureMap[type] || '/textures/placeholder-default.jpg';
};

// Medical simulation constants
export const MEDICAL_CONSTANTS = {
  TISSUE_DENSITY: 1.06, // g/cm³
  BLOOD_VISCOSITY: 0.004, // Pa·s
  SURGICAL_PRECISION: 0.1, // mm
  HAPTIC_FEEDBACK_STRENGTH: 0.7,
  DEFAULT_LIGHTING: {
    ambient: 0.4,
    directional: 1.0,
    point: 0.5
  }
};
