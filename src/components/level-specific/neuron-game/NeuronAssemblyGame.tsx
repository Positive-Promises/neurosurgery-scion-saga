import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { NEURON_PARTS, NEURON_DROP_ZONES, NeuronPart } from '@/data/neuronParts';
import DraggableNeuronPart from './DraggableNeuronPart';
import NeuronDropZone from './NeuronDropZone';

interface NeuronAssemblyGameProps {
  onGameComplete: () => void;
}

const NeuronAssemblyGame: React.FC<NeuronAssemblyGameProps> = ({ onGameComplete }) => {
  const [availableParts, setAvailableParts] = useState<NeuronPart[]>(NEURON_PARTS);
  const [placedParts, setPlacedParts] = useState<Record<string, NeuronPart | null>>(
    NEURON_DROP_ZONES.reduce((acc, zone) => ({ ...acc, [zone.id]: null }), {})
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (over && over.data.current?.accepts === active.id) {
      const partId = active.id as string;
      const dropZoneId = over.id as string;

      const part = NEURON_PARTS.find(p => p.id === partId);
      if (part) {
        setPlacedParts(prev => ({ ...prev, [dropZoneId]: part }));
        setAvailableParts(prev => prev.filter(p => p.id !== partId));

        if (availableParts.length === 1) {
          onGameComplete();
        }
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full h-full flex flex-col items-center justify-between p-4">
        {/* Top Area: Draggable Parts */}
        <div className="w-full flex justify-center items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
          {availableParts.length > 0 ? (
            availableParts.map(part => <DraggableNeuronPart key={part.id} part={part} />)
          ) : (
            <p className="text-green-400 font-bold">All parts placed!</p>
          )}
        </div>

        {/* Middle Area: Assembly Canvas */}
        <div className="w-full h-full relative my-4">
          <div className="absolute inset-0 bg-gray-900/70 rounded-lg">
            {NEURON_DROP_ZONES.map(zone => (
              <NeuronDropZone
                key={zone.id}
                zone={zone}
                correctPart={placedParts[zone.id]}
                isOccupied={!!placedParts[zone.id]}
              />
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default NeuronAssemblyGame;
