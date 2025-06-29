
import React, { useState } from 'react';
import GameEngine from './GameEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowLeft } from 'lucide-react';

interface GameLauncherProps {
  level: {
    id: number;
    title: string;
    subtitle: string;
    objectives: string[];
    xp: number;
  };
  onClose: () => void;
}

const GameLauncher: React.FC<GameLauncherProps> = ({ level, onClose }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [finalScore, setFinalScore] = useState(0);

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleGameComplete = (score: number) => {
    setFinalScore(score);
    setGameState('completed');
  };

  const handleGameExit = () => {
    setGameState('menu');
  };

  if (gameState === 'playing') {
    return (
      <GameEngine
        level={{
          id: level.id,
          title: level.title,
          gameType: 'anatomy', // This would be dynamic based on level
          objectives: level.objectives
        }}
        onComplete={handleGameComplete}
        onExit={handleGameExit}
      />
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800 border-green-500">
          <CardHeader className="text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-white">Level Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-green-400">
              <p className="text-lg font-semibold">Final Score: {finalScore}</p>
              <p className="text-sm">+{level.xp} XP Earned</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleStartGame} className="flex-1">
                Play Again
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800 border-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            Case {level.id}: {level.title}
          </CardTitle>
          <p className="text-blue-300">{level.subtitle}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-white font-semibold mb-3">Learning Objectives:</h4>
            <ul className="space-y-2">
              {level.objectives.map((objective, index) => (
                <li key={index} className="text-gray-300 flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  {objective}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h4 className="text-cyan-400 font-semibold mb-2">Game Instructions:</h4>
            <p className="text-gray-300 text-sm">
              Use your mouse to rotate and examine the 3D anatomical models. 
              Click on structures to identify them according to the learning objectives. 
              Complete all objectives to master this level.
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleStartGame} className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600">
              Enter Operating Room
            </Button>
            <Button variant="outline" onClick={onClose} className="border-gray-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameLauncher;
