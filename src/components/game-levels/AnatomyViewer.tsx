
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

interface AnatomyViewerProps {
  levelId: number;
  objectives: string[];
  onObjectiveComplete: (index: number, points: number) => void;
  onError: () => void;
}

const AnatomyViewer: React.FC<AnatomyViewerProps> = ({
  levelId,
  objectives,
  onObjectiveComplete,
  onError
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [completedObjectives, setCompletedObjectives] = useState<Set<number>>(new Set());

  // Rotate the brain model slowly
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Level 1: Neuroanatomical Foundations
  const anatomyParts = [
    { id: 'cerebrum', position: [0, 1, 0], color: '#ff6b6b', label: 'Cerebrum' },
    { id: 'cerebellum', position: [0, -0.5, -1], color: '#4ecdc4', label: 'Cerebellum' },
    { id: 'brainstem', position: [0, 0, 0], color: '#45b7d1', label: 'Brainstem' },
    { id: 'ventricles', position: [0, 0.5, 0.5], color: '#96ceb4', label: 'Ventricles' },
  ];

  const handlePartClick = (partId: string, partIndex: number) => {
    if (completedObjectives.has(partIndex)) return;

    // Check if this is the correct part for the current objective
    const currentObjectiveIndex = completedObjectives.size;
    const expectedParts = ['cerebrum', 'cerebellum', 'brainstem', 'ventricles'];
    
    if (partId === expectedParts[currentObjectiveIndex]) {
      setCompletedObjectives(prev => new Set([...prev, currentObjectiveIndex]));
      onObjectiveComplete(currentObjectiveIndex, 100);
    } else {
      onError();
    }
  };

  return (
    <group ref={groupRef}>
      {/* Main Brain Structure */}
      {anatomyParts.map((part, index) => (
        <group key={part.id} position={part.position}>
          <Sphere
            args={[0.8, 16, 16]}
            onClick={() => handlePartClick(part.id, index)}
            onPointerOver={() => setHoveredPart(part.id)}
            onPointerOut={() => setHoveredPart(null)}
          >
            <meshStandardMaterial
              color={part.color}
              transparent
              opacity={hoveredPart === part.id ? 0.8 : 0.6}
              roughness={0.3}
              metalness={0.1}
            />
          </Sphere>
          
          {hoveredPart === part.id && (
            <Text
              position={[0, 1.5, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {part.label}
            </Text>
          )}
          
          {completedObjectives.has(index) && (
            <Text
              position={[0, 1.2, 0]}
              fontSize={0.2}
              color="#00ff00"
              anchorX="center"
              anchorY="middle"
            >
              ✓
            </Text>
          )}
        </group>
      ))}

      {/* Neural Network Visualization */}
      <group position={[3, 0, 0]}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Box
            key={i}
            args={[0.1, 0.1, 0.1]}
            position={[
              Math.sin(i * 0.5) * 2,
              Math.cos(i * 0.3) * 2,
              Math.sin(i * 0.7) * 2
            ]}
          >
            <meshStandardMaterial color="#ffd93d" emissive="#ffaa00" emissiveIntensity={0.2} />
          </Box>
        ))}
      </group>

      {/* Instructional Text */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.4}
        color="cyan"
        anchorX="center"
        anchorY="middle"
      >
        Level {levelId}: Identify Brain Structures
      </Text>
    </group>
  );
};

export default AnatomyViewer;
