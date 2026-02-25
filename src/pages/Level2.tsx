import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfessionalTopBar from '@/components/game/ProfessionalTopBar';
import Level2Gameplay2D from '@/components/level-specific/Level2Gameplay2D';
// Placeholder for the 3D component
// import Level2Gameplay3D from '@/components/level-specific/Level2Gameplay3D';
import { Button } from "@/components/ui/button";

const Level2: React.FC = () => {
  const [is2D, setIs2D] = useState(true);
  const navigate = useNavigate();

  const levelInfo = {
    id: 2,
    title: "Spinal Neurosurgeon"
  };

  const handleExit = () => {
    navigate('/');
  };

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
      <header className="h-16 bg-gray-800/50 backdrop-blur-sm border-b border-white/10">
        <ProfessionalTopBar
          level={levelInfo}
          score={0} // Placeholder
          gameState="playing" // Placeholder
          audioEnabled={true} // Placeholder
          onPause={() => {}} // Placeholder
          onResume={() => {}} // Placeholder
          onExit={handleExit}
          onToggleAudio={() => {}} // Placeholder
        />
      </header>
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-7xl h-full bg-gray-700/30 rounded-xl shadow-2xl p-4">
          {is2D ? <Level2Gameplay2D /> : <div className="flex items-center justify-center h-full"><p>3D View (Not Implemented)</p></div>}
        </div>
      </main>
      <footer className="flex justify-center p-4">
        <div className="flex space-x-4">
            <Button onClick={() => setIs2D(true)} variant={is2D ? "secondary" : "default"}>
              2D View
            </Button>
            <Button onClick={() => setIs2D(false)} variant={!is2D ? "secondary" : "default"}>
              3D View
            </Button>
        </div>
      </footer>
    </div>
  );
};

export default Level2;
