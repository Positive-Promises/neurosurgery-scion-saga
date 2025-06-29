
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Stethoscope, Trophy, Zap, Target } from 'lucide-react';

interface PlayerStatsProps {
  playerStats: {
    totalXP: number;
    level: number;
    completedLevels: number;
    achievements: string[];
    surgicalRank: string;
  };
  totalLevels: number;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ playerStats, totalLevels }) => {
  const getSurgicalRank = () => {
    if (playerStats.totalXP >= 4000) return "Master Neurosurgeon";
    if (playerStats.totalXP >= 3000) return "Attending Neurosurgeon";
    if (playerStats.totalXP >= 2000) return "Neurosurgery Fellow";
    if (playerStats.totalXP >= 1000) return "Chief Resident";
    if (playerStats.totalXP >= 500) return "Senior Resident";
    if (playerStats.totalXP >= 100) return "Junior Resident";
    return "Medical Student";
  };

  const calculateProgress = () => {
    return (playerStats.completedLevels / totalLevels) * 100;
  };

  return (
    <div className="text-center mb-8">
      <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4">
        NEUROSURGICAL SCION
      </h1>
      <p className="text-xl text-gray-300 mb-6">Master the Art and Science of Neurosurgery</p>
      
      {/* Enhanced Player Stats */}
      <div className="flex justify-center items-center gap-8 mb-8">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-cyan-400" />
          <span className="text-white font-semibold">{getSurgicalRank()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-white font-semibold">Level {playerStats.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-500" />
          <span className="text-white font-semibold">{playerStats.totalXP} XP</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-green-500" />
          <span className="text-white font-semibold">{playerStats.completedLevels}/{totalLevels} Cases</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto">
        <Progress value={calculateProgress()} className="h-3 bg-gray-700" />
        <p className="text-sm text-gray-400 mt-2">Surgical Mastery Progress: {Math.round(calculateProgress())}%</p>
      </div>
    </div>
  );
};

export default PlayerStats;
