
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Lock, Play, BookOpen } from 'lucide-react';

interface GameLevelProps {
  level: {
    id: number;
    title: string;
    subtitle: string;
    difficulty: string;
    locked: boolean;
    completed: boolean;
    description: string;
    objectives: string[];
    boss: string;
    xp: number;
    estimatedTime: string;
    surgicalFocus: string;
  };
  onLevelSelect: (level: any) => void;
  onShowDetails: (level: any) => void;
}

const GameLevel: React.FC<GameLevelProps> = ({ level, onLevelSelect, onShowDetails }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Resident': return 'bg-green-500';
      case 'Chief Resident': return 'bg-yellow-500';
      case 'Fellow': return 'bg-orange-500';
      case 'Attending': return 'bg-red-500';
      case 'Expert': return 'bg-purple-500';
      case 'Master Surgeon': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card 
      className={`relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer ${
        level.locked 
          ? 'bg-gray-800/50 border-gray-600' 
          : level.completed 
            ? 'bg-green-900/50 border-green-500' 
            : 'bg-blue-900/50 border-blue-500 hover:bg-blue-800/50'
      }`}
      onClick={() => !level.locked && onLevelSelect(level)}
    >
      {/* Difficulty Badge */}
      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(level.difficulty)}`}>
        {level.difficulty}
      </div>

      {/* Lock Overlay */}
      {level.locked && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          Case {level.id}
        </CardTitle>
        <div>
          <h3 className="text-blue-300 font-semibold">{level.title}</h3>
          <p className="text-gray-400 text-sm">{level.subtitle}</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-cyan-400 text-sm font-semibold">+{level.xp} XP</span>
            <span className="text-gray-400 text-sm">{level.estimatedTime}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">Challenge: {level.boss}</span>
          </div>

          <div className="text-xs text-gray-400 mt-1">
            Focus: {level.surgicalFocus}
          </div>

          {!level.locked && (
            <Button 
              className="w-full mt-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                onShowDetails(level);
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              {level.completed ? 'Review Case' : 'Begin Surgery'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameLevel;
