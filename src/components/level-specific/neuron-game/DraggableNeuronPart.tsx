import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { NeuronPart } from '@/data/neuronParts';
import { Card, CardContent } from '@/components/ui/card';

interface DraggableNeuronPartProps {
  part: NeuronPart;
}

const DraggableNeuronPart: React.FC<DraggableNeuronPartProps> = ({ part }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: part.id,
    data: { part },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
        cursor: 'grabbing',
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="touch-none"
    >
      <Card className="w-40 h-24 flex flex-col items-center justify-center p-2 bg-gray-700 border-gray-600 hover:bg-gray-600 cursor-grab">
        <CardContent className="p-0 flex flex-col items-center justify-center">
          <img src={part.image} alt={part.name} className="w-12 h-12 mb-2" />
          <p className="text-sm text-center text-white">{part.name}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraggableNeuronPart;
