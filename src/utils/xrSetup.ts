
import 'webxr-polyfill';

// WebXR feature detection and setup
export const setupWebXR = async (): Promise<boolean> => {
  try {
    // Check if WebXR is supported
    if (!navigator.xr) {
      console.warn('WebXR not supported, using polyfill');
      return false;
    }

    // Check for VR session support
    const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
    const arSupported = await navigator.xr.isSessionSupported('immersive-ar');

    console.log('WebXR Support:', {
      VR: vrSupported,
      AR: arSupported
    });

    return vrSupported || arSupported;
  } catch (error) {
    console.error('WebXR setup failed:', error);
    return false;
  }
};

// Initialize WebXR features
export const initializeXRFeatures = () => {
  // Set up WebXR event listeners
  if (navigator.xr) {
    navigator.xr.addEventListener('devicechange', () => {
      console.log('XR device changed');
    });
  }

  // Add WebXR DOM overlay support
  const style = document.createElement('style');
  style.textContent = `
    .xr-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    }
    
    .xr-overlay > * {
      pointer-events: auto;
    }
  `;
  document.head.appendChild(style);
};

// WebXR performance optimization
export const optimizeXRPerformance = () => {
  // Set up frame rate optimization
  if (navigator.xr) {
    // Request 90fps for VR if supported
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.imageRendering = 'pixelated';
      canvas.style.imageRendering = 'crisp-edges';
    }
  }
};
