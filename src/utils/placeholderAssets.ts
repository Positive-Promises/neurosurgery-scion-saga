
// Utility to create placeholder assets when real files aren't available
export const createPlaceholderAudio = (context: AudioContext, type: 'ambient' | 'success' | 'error'): AudioBuffer => {
  const sampleRate = context.sampleRate;
  const duration = type === 'ambient' ? 2 : 0.5;
  const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    switch (type) {
      case 'ambient':
        // Generate soft pink noise for ambient
        data[i] = (Math.random() * 2 - 1) * 0.1 * Math.sin(i * 0.001);
        break;
      case 'success':
        // Generate pleasant ascending tone
        data[i] = Math.sin(2 * Math.PI * (440 + i * 0.1) * i / sampleRate) * 0.3 * Math.exp(-i * 0.001);
        break;
      case 'error':
        // Generate descending alert tone
        data[i] = Math.sin(2 * Math.PI * (220 - i * 0.05) * i / sampleRate) * 0.2 * Math.exp(-i * 0.002);
        break;
    }
  }

  return buffer;
};

export const checkAssetAvailability = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Placeholder 3D model data
export const createSimpleBrainGeometry = () => {
  // This would return basic geometric data for a brain-like shape
  return {
    vertices: new Float32Array([
      // Simplified brain geometry vertices
      -1, 0, 0,  1, 0, 0,  0, 1, 0,
      -1, 0, 0,  0, 1, 0,  0, 0, 1,
    ]),
    normals: new Float32Array([
      0, 0, 1,  0, 0, 1,  0, 0, 1,
      0, 1, 0,  0, 1, 0,  0, 1, 0,
    ])
  };
};
