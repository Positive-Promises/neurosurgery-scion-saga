
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupWebXR, initializeXRFeatures, optimizeXRPerformance } from './utils/xrSetup';

// Initialize WebXR and performance optimizations
const initializeApp = async () => {
  try {
    // Set up WebXR
    const xrSupported = await setupWebXR();
    if (xrSupported) {
      initializeXRFeatures();
      optimizeXRPerformance();
    }

    // Initialize React app
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error('App initialization failed:', error);
    // Fallback initialization
    createRoot(document.getElementById("root")!).render(<App />);
  }
};

initializeApp();
