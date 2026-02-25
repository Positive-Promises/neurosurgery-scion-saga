import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Level3Gameplay2D from '@/components/level-specific/Level3Gameplay2D';
// Placeholder for the 3D component
// import Level3Gameplay3D from '@/components/level-specific/Level3Gameplay3D';

const Level3: React.FC = () => {
  const [is2D, setIs2D] = useState(true);

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-extrabold mb-4">Level 3: Cranial Anatomy</h1>
      <p className="text-xl mb-8">Explore the bones of the human skull.</p>

      <div className="w-full max-w-4xl h-3/4 bg-gray-700 rounded-xl shadow-2xl p-4 mb-4">
        {is2D ? <Level3Gameplay2D /> : <div className="flex items-center justify-center h-full"><p>3D View (Not Implemented)</p></div>}
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

export default Level3;
