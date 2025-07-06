import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Level1GameplayProps {
  onObjectiveComplete: (objective: string, points: number) => void;
}

const Level1Gameplay: React.FC<Level1GameplayProps> = ({ onObjectiveComplete }) => {
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
              onPointerOver={() => setHoveredPart(part.name)}
              onPointerOut={() => setHoveredPart(null)}
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
    <div className="fixed inset-0 w-full h-full relative">
      <Canvas camera={{ position: [5, 2, 5], fov: 60 }} className="w-full h-full">
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          maxDistance={10}
          minDistance={2}
        />

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
      </Canvas>

      {/* Progress indicator */}
      <div className="absolute top-4 left-4 bg-black/50 p-4 rounded-lg z-10">
        <h3 className="text-white font-bold mb-2">Progress</h3>
        <p className="text-cyan-400">
          Parts Identified: {labeledParts.size}/6
        </p>
        {hoveredPart && (
          <p className="text-yellow-400 mt-2">
            Hovering: {hoveredPart.replace('-', ' ').toUpperCase()}
          </p>
        )}
      </div>
    </div>
  );
};

export default Level1Gameplay;