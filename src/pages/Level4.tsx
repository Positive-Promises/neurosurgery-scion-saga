import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Level4Gameplay2D from '@/components/level-specific/Level4Gameplay2D';

const Level4: React.FC = () => {
  const [is2D, setIs2D] = useState(true);

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-extrabold mb-4">Level 4: Spinal Cord Anatomy</h1>
      <p className="text-xl mb-8">Explore the cross-section of the human spinal cord.</p>

      <div className="w-full max-w-4xl h-3/4 bg-gray-700 rounded-xl shadow-2xl p-4 mb-4">
        {is2D ? <Level4Gameplay2D /> : <div className="flex items-center justify-center h-full"><p>3D View (Not Implemented)</p></div>}
      </div>

      <div className="flex space-x-4">
        <Button onClick={() => setIs2D(true)} variant={is2D ? "secondary" : "default"}>
          2D View
        </Button>
        <Button onClick={() => setIs2D(false)} variant={!is2D ? "secondary" : "default"}>
          3D View
        </Button>
      </div>
    </div>
  );
};

export default Level4;
