import React, { useState } from 'react';
import SpineSVG from './SpineSVG';

// Define a type for the tools
type Tool = 'scalpel' | 'forceps' | 'drill' | 'probe';

const Level2Gameplay2D: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const handleRegionClick = (region: string) => {
    if (!selectedTool) {
      setFeedbackMessage('Please select a tool first.');
      return;
    }
    setSelectedRegion(region);
    setFeedbackMessage(`Used ${selectedTool} on ${region} spine.`);
    // Here you could add more complex logic based on the tool and region
  };

  const selectTool = (tool: Tool) => {
    setSelectedTool(tool);
    setFeedbackMessage(`Selected tool: ${tool}. Now click on a spine region.`);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Level 2: 2D Spinal Surgery Simulation</h2>

      <div className="w-full flex-grow flex items-center justify-center mb-4">
        <SpineSVG onRegionClick={handleRegionClick} />
      </div>

      <div id="game-info" className="w-full text-center mb-4">
        {selectedRegion && <p className="text-xl text-green-600">Last Action: {feedbackMessage}</p>}
        {!selectedRegion && <p className="text-xl text-blue-600">{feedbackMessage || 'Select a tool and then a spine region.'}</p>}
      </div>

      <div id="toolbox" className="flex items-center justify-center p-2 bg-white rounded-md shadow-md">
        <h3 className="text-lg font-semibold mr-4">Tools:</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => selectTool('scalpel')}
            className={`px-4 py-2 rounded ${selectedTool === 'scalpel' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Scalpel
          </button>
          <button
            onClick={() => selectTool('forceps')}
            className={`px-4 py-2 rounded ${selectedTool === 'forceps' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Forceps
          </button>
          <button
            onClick={() => selectTool('drill')}
            className={`px-4 py-2 rounded ${selectedTool === 'drill' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Drill
          </button>
           <button
            onClick={() => selectTool('probe')}
            className={`px-4 py-2 rounded ${selectedTool === 'probe' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Probe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Level2Gameplay2D;
