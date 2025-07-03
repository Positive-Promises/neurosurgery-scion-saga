import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Level2GameplayProps {
  onObjectiveComplete: (objective: string, points: number) => void;
}

const Level2Gameplay: React.FC<Level2GameplayProps> = ({ onObjectiveComplete }) => {
  const [approachType, setApproachType] = useState<'posterior' | 'anterior' | null>(null);
  const [toolSelected, setToolSelected] = useState<string | null>(null);
  const [procedureStep, setProcedureStep] = useState(0);

  // Interactive Spine Model
  const InteractiveSpine: React.FC = () => {
    const spineRef = useRef<THREE.Group>(null);

    const vertebrae = Array.from({ length: 7 }, (_, i) => ({
      id: `C${i + 1}`,
      position: [0, 2 - i * 0.4, 0] as [number, number, number],
      color: '#8e44ad'
    }));

    const handleVertebraeClick = (vertebra: string) => {
      if (approachType) {
        onObjectiveComplete(`${approachType} approach to ${vertebra}`, 150);
        setProcedureStep(prev => prev + 1);
      }
    };

    return (
      <group ref={spineRef}>
        {vertebrae.map((vertebra) => (
          <group key={vertebra.id}>
            <mesh
              position={vertebra.position}
              onClick={() => handleVertebraeClick(vertebra.id)}
            >
              <cylinderGeometry args={[0.3, 0.3, 0.2]} />
              <meshStandardMaterial 
                color={vertebra.color}
                transparent
                opacity={0.8}
              />
            </mesh>
            
            <Text
              position={[vertebra.position[0] + 1, vertebra.position[1], vertebra.position[2]]}
              fontSize={0.2}
              color="#ffffff"
            >
              {vertebra.id}
            </Text>
          </group>
        ))}
        
        {/* Spinal cord */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3]} />
          <meshStandardMaterial color="#ff6b6b" transparent opacity={0.6} />
        </mesh>
      </group>
    );
  };

  // Surgical tools for spine surgery
  const SurgicalTools: React.FC = () => {
    const tools = [
      { name: 'laminectomy-rongeur', position: [-3, 1, 0], color: '#34495e' },
      { name: 'discectomy-forceps', position: [-3, 0, 0], color: '#2c3e50' },
      { name: 'microsurgical-scissors', position: [-3, -1, 0], color: '#7f8c8d' }
    ];

    return (
      <group>
        {tools.map((tool) => (
          <mesh
            key={tool.name}
            position={tool.position as [number, number, number]}
            onClick={() => setToolSelected(tool.name)}
          >
            <boxGeometry args={[0.1, 0.8, 0.1]} />
            <meshStandardMaterial 
              color={tool.color}
              emissive={toolSelected === tool.name ? new THREE.Color(0x444444) : new THREE.Color(0x000000)}
            />
          </mesh>
        ))}
      </group>
    );
  };

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [5, 2, 5], fov: 60 }}>
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

        <InteractiveSpine />
        <SurgicalTools />

        <Text
          position={[0, 4, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Spinal Neurosurgery
        </Text>
      </Canvas>

      {/* Surgical approach selection */}
      <div className="absolute top-4 left-4 bg-black/50 p-4 rounded-lg">
        <h3 className="text-white font-bold mb-2">Surgical Approach</h3>
        <div className="space-y-2">
          <button
            onClick={() => setApproachType('posterior')}
            className={`w-full p-2 rounded ${
              approachType === 'posterior' ? 'bg-blue-600' : 'bg-gray-600'
            } text-white`}
          >
            Posterior Approach
          </button>
          <button
            onClick={() => setApproachType('anterior')}
            className={`w-full p-2 rounded ${
              approachType === 'anterior' ? 'bg-blue-600' : 'bg-gray-600'
            } text-white`}
          >
            Anterior Approach
          </button>
        </div>
        
        {toolSelected && (
          <div className="mt-4">
            <p className="text-cyan-400">Selected: {toolSelected.replace('-', ' ')}</p>
          </div>
        )}
        
        <p className="text-yellow-400 mt-2">Procedure Step: {procedureStep}/7</p>
      </div>
    </div>
  );
};

export default Level2Gameplay;