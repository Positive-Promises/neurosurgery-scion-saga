import React, { useState } from 'react';
import BrainSVG from './BrainSVG';

const Level1Gameplay2D: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-lg p-4">
      <h2 className="text-2xl text-white mb-4">Level 1 - 2D Brain Anatomy</h2>
      <div className="w-full max-w-4xl">
        <BrainSVG onRegionClick={handleRegionClick} />
      </div>
      {selectedRegion && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-xl text-white">Selected Region:</h3>
          <p className="text-lg text-blue-300">{selectedRegion}</p>
        </div>
      )}
    </div>
  );
};

export default Level1Gameplay2D;
