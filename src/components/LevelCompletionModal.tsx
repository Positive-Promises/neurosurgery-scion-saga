import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Award, RefreshCw, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

interface LevelCompletionModalProps {
  level: {
    id: number;
    title: string;
  };
  score: number;
  onReplay: () => void;
  onNextLevel: () => void;
}

const LevelCompletionModal: React.FC<LevelCompletionModalProps> = ({ level, score, onReplay, onNextLevel }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-gray-800/80 border border-cyan-400/30 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center text-white">
        <Award className="w-24 h-24 mx-auto text-yellow-400 mb-4" />
        <h2 className="text-4xl font-extrabold text-white mb-2">Level Complete!</h2>
        <p className="text-lg text-gray-300 mb-6">You have successfully completed {level.title}.</p>

        <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
          <p className="text-lg text-gray-400">Score</p>
          <p className="text-5xl font-bold text-cyan-400">{score}</p>
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={onReplay} variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
            <RefreshCw className="w-5 h-5 mr-2" />
            Replay Level
          </Button>
          <Button onClick={onNextLevel} className="bg-cyan-500 hover:bg-cyan-600">
            Proceed to Next Level
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LevelCompletionModal;
