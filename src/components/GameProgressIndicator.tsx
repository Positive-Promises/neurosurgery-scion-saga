import React from 'react';

interface GameProgressIndicatorProps {
  labeledParts: number;
  totalParts: number;
  hoveredPart: string | null;
}

const GameProgressIndicator: React.FC<GameProgressIndicatorProps> = ({
  labeledParts,
  totalParts,
  hoveredPart
}) => {
  return (
    <div className="absolute top-4 left-4 bg-black/50 p-4 rounded-lg z-10">
      <h3 className="text-white font-bold mb-2">Progress</h3>
      <p className="text-cyan-400">
        Parts Identified: {labeledParts}/{totalParts}
      </p>
      {hoveredPart && (
        <p className="text-yellow-400 mt-2">
          Hovering: {hoveredPart.replace('-', ' ').toUpperCase()}
        </p>
      )}
    </div>
  );
};

export default GameProgressIndicator;