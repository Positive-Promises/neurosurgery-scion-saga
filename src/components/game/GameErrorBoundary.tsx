
import React from 'react';

interface GameErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface GameErrorBoundaryState {
  hasError: boolean;
}

export class GameErrorBoundary extends React.Component<GameErrorBoundaryProps, GameErrorBoundaryState> {
  constructor(props: GameErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export const Canvas3DFallback: React.FC = () => (
  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
    <div className="text-center text-white">
      <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h3 className="text-xl font-bold mb-2">3D Environment Loading...</h3>
      <p className="text-gray-300">Please wait while we prepare the medical simulation</p>
    </div>
  </div>
);
