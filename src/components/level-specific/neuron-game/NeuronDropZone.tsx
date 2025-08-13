import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DropZone, NeuronPart } from '@/data/neuronParts';
import { cn } from '@/lib/utils';

interface NeuronDropZoneProps {
  zone: DropZone;
  correctPart: NeuronPart | null;
  isOccupied: boolean;
}

const NeuronDropZone: React.FC<NeuronDropZoneProps> = ({ zone, correctPart, isOccupied }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: zone.id,
    data: {
      accepts: zone.id.replace('drop-', 'part-'),
    },
    disabled: isOccupied,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        top: zone.position.top,
        left: zone.position.left,
        width: zone.size.width,
        height: zone.size.height,
        transform: 'translate(-50%, -50%)',
      }}
      className={cn(
        'border-2 border-dashed rounded-lg flex items-center justify-center transition-colors',
        isOver && !isOccupied ? 'border-green-400 bg-green-900/50' : 'border-gray-500',
        isOccupied ? 'border-solid border-green-500 bg-green-900/30' : ''
      )}
    >
      {isOccupied && correctPart ? (
        <div className="flex flex-col items-center text-white">
          <img src={correctPart.image} alt={correctPart.name} className="w-16 h-16 opacity-80" />
          <p className="text-xs font-bold mt-1">{correctPart.name}</p>
        </div>
      ) : (
        <p className="text-gray-400 text-xs">{zone.name}</p>
      )}
    </div>
  );
};

export default NeuronDropZone;
