
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Trophy, Clock, CheckCircle2, Circle } from 'lucide-react';

interface ObjectivesPanelProps {
  level: {
    id: number;
    title: string;
    objectives: string[];
  };
  score: number;
  progress: number;
  identifiedCount: number;
  totalRegions: number;
  className?: string;
}

const ObjectivesPanel: React.FC<ObjectivesPanelProps> = ({
  level,
  score,
  progress,
  identifiedCount,
  totalRegions,
  className = ''
}) => {
  const completedObjectives = Math.floor((progress / 100) * level.objectives.length);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <CardHeader className="border-b border-slate-600">
        <CardTitle className="flex items-center justify-between text-cyan-400">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Mission Objectives</span>
          </div>
          <Badge variant="secondary" className="bg-cyan-900/30 text-cyan-300">
            Level {level.id}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-4 space-y-6 overflow-auto">
        {/* Score Display */}
        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-lg p-4 border border-blue-700/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-white">Score</span>
            </div>
            <span className="text-2xl font-bold text-yellow-400">{score}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress</span>
              <span className="text-cyan-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Identification Progress */}
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-700/30">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-white">Brain Regions</span>
            <Badge variant="outline" className="text-green-400 border-green-400">
              {identifiedCount}/{totalRegions}
            </Badge>
          </div>
          
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: totalRegions }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-sm ${
                  index < identifiedCount
                    ? 'bg-green-400'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Objectives List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white mb-3">Mission Tasks</h3>
          <div className="space-y-3">
            {level.objectives.map((objective, index) => {
              const isCompleted = index < completedObjectives;
              const isActive = index === completedObjectives && progress < 100;
              
              return (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-900/20 border border-green-700/30'
                      : isActive
                      ? 'bg-blue-900/20 border border-blue-700/30 ring-1 ring-blue-500/20'
                      : 'bg-slate-700/30 border border-slate-600/30'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm leading-relaxed ${
                      isCompleted
                        ? 'text-green-300 line-through'
                        : isActive
                        ? 'text-blue-300 font-medium'
                        : 'text-gray-300'
                    }`}>
                      {objective}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <h4 className="font-medium text-cyan-400 mb-2">Instructions</h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            Click on brain regions in the 3D model to identify them. 
            Each correct identification will advance your progress and unlock detailed anatomical information.
          </p>
        </div>
      </CardContent>
    </div>
  );
};

export default ObjectivesPanel;
