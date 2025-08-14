import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import SafeBrainModel from '@/components/3d/SafeBrainModel';
import CSFSystem from './CSFSystem';
import { GameErrorBoundary, Canvas3DFallback } from '@/components/game/GameErrorBoundary';

const Level1CSFView: React.FC = () => {
  return (
    <GameErrorBoundary fallback={<Canvas3DFallback />}>
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Suspense fallback={null}>
          {/* Render the brain model semi-transparently as a reference */}
          <group>
            <SafeBrainModel
              onRegionClick={() => {}}
              onRegionHover={() => {}}
              labeledRegions={new Set()}
            />
          </group>

          {/* Render the CSF flow animation system */}
          <CSFSystem />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={4}
          maxDistance={20}
        />

        <Text
          position={[0, 4, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Cerebrospinal Fluid (CSF) Flow
        </Text>
        <Text
          position={[0, -4, 0]}
          fontSize={0.2}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
          maxWidth={8}
          textAlign="center"
        >
          This animation shows the general path of CSF as it flows through the brain's ventricular system.
        </Text>
      </Canvas>
    </GameErrorBoundary>
  );
};

export default Level1CSFView;
