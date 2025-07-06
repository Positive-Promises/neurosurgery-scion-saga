
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PlayerStats from '@/components/PlayerStats';
import GameLevel from '@/components/GameLevel';
import LevelDetailsModal from '@/components/LevelDetailsModal';
import GameLauncher from '@/components/GameLauncher';
import { GAME_LEVELS } from '@/data/gameLevels';
import { RootState } from '@/store/gameStore';

const NeurosurgicalScion = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showLevelDetails, setShowLevelDetails] = useState(false);
  const [showGameLauncher, setShowGameLauncher] = useState(false);
  // Get player stats from Redux store
  const playerStats = useSelector((state: RootState) => state.game.player);

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setShowLevelDetails(true);
  };

  const handleStartLevel = () => {
    setShowLevelDetails(false);
    setShowGameLauncher(true);
  };

  const handleCloseModal = () => {
    setSelectedLevel(null);
    setShowLevelDetails(false);
  };

  const handleCloseLauncher = () => {
    setShowGameLauncher(false);
    setSelectedLevel(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Enhanced Medical Background */}
      <div className="fixed inset-0 opacity-15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.4),transparent_50%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <PlayerStats 
            playerStats={playerStats} 
            totalLevels={GAME_LEVELS.length} 
          />

          {/* Game Levels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {GAME_LEVELS.map((level) => (
              <GameLevel
                key={level.id}
                level={level}
                onLevelSelect={handleLevelSelect}
                onShowDetails={handleLevelSelect}
              />
            ))}
          </div>

          {/* Level Details Modal */}
          <LevelDetailsModal
            level={selectedLevel}
            isVisible={showLevelDetails}
            onClose={handleCloseModal}
            onStartLevel={handleStartLevel}
          />

          {/* Game Launcher */}
          {showGameLauncher && selectedLevel && (
            <GameLauncher
              level={selectedLevel}
              onClose={handleCloseLauncher}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NeurosurgicalScion;
