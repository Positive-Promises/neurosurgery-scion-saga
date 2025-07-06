import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Level1GameplayProps {
  onObjectiveComplete: (objective: string, points: number) => void;
  onHoverChange?: (partName: string | null) => void;
}

const Level1Gameplay: React.FC<Level1GameplayProps> = ({ onObjectiveComplete, onHoverChange }) => {
  const [labeledParts, setLabeledParts] = useState<Set<string>>(new Set());
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Interactive Brain Model for Level 1
  const InteractiveBrain: React.FC = () => {
    const brainRef = useRef<THREE.Group>(null);

    const brainParts = [
      { name: 'frontal-lobe', position: [0, 1, 1], color: '#ff6b6b', label: 'Frontal Lobe' },
      { name: 'parietal-lobe', position: [0, 1, -0.5], color: '#4ecdc4', label: 'Parietal Lobe' },
      { name: 'temporal-lobe', position: [-1.2, 0, 0], color: '#45b7d1', label: 'Temporal Lobe' },
      { name: 'occipital-lobe', position: [0, 0.5, -1.5], color: '#96ceb4', label: 'Occipital Lobe' },
      { name: 'cerebellum', position: [0, -1, -1], color: '#feca57', label: 'Cerebellum' },
      { name: 'brainstem', position: [0, -0.5, 0], color: '#ff9ff3', label: 'Brainstem' }
    ];

    const handlePartClick = (partName: string, label: string) => {
      if (!labeledParts.has(partName)) {
        setLabeledParts(prev => new Set(prev.add(partName)));
        onObjectiveComplete(`Identify ${label}`, 100);
      }
    };

    return (
      <group ref={brainRef}>
        {brainParts.map((part) => (
          <group key={part.name}>
            <mesh
              position={part.position as [number, number, number]}
              onClick={() => handlePartClick(part.name, part.label)}
              onPointerOver={() => {
                setHoveredPart(part.name);
                onHoverChange?.(part.name);
              }}
              onPointerOut={() => {
                setHoveredPart(null);
                onHoverChange?.(null);
              }}
            >
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial 
                color={part.color}
                transparent
                opacity={hoveredPart === part.name ? 0.8 : 0.6}
                emissive={hoveredPart === part.name ? new THREE.Color(0x444444) : new THREE.Color(0x000000)}
              />
            </mesh>
            
            {/* Labels for identified parts */}
            {labeledParts.has(part.name) && (
              <Text
                position={[part.position[0], part.position[1] + 1.5, part.position[2]]}
                fontSize={0.3}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {part.label}
              </Text>
            )}
          </group>
        ))}
      </group>
    );
  };

  // CSF Flow Simulation
  const CSFFlow: React.FC = () => {
    const particlesRef = useRef<THREE.Points>(null);

    return (
      <points ref={particlesRef}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <pointsMaterial color="#00ffff" transparent opacity={0.6} />
      </points>
    );
  };

  return (
    <>
      <InteractiveBrain />
      <CSFFlow />

      {/* Educational annotations */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Neuroanatomical Foundations
      </Text>
    </>
  );
};

export default Level1Gameplay;