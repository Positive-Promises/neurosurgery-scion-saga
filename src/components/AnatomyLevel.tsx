import React, { useState } from 'react';

interface AnatomyLevelProps {
  title: string;
  initialFeedback: string;
  SVGComponent: React.FC<{ onRegionClick: (region: string) => void }>;
}

const AnatomyLevel: React.FC<AnatomyLevelProps> = ({ title, initialFeedback, SVGComponent }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>(initialFeedback);

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
    setFeedbackMessage(`You have selected the ${region}.`);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>

      <div className="w-full flex-grow flex items-center justify-center mb-4">
        <SVGComponent onRegionClick={handleRegionClick} />
      </div>

      <div id="game-info" className="w-full text-center mb-4">
        <p className="text-xl text-blue-600">{feedbackMessage}</p>
      </div>
    </div>
  );
};

export default AnatomyLevel;
