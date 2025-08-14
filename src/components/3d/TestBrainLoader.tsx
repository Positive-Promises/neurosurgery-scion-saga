import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

const BrainModelTest = () => {
  try {
    const { scene } = useGLTF('/models/brain-anatomy.glb');
    console.log('Brain model loaded successfully:', scene);
    return <primitive object={scene} scale={[1, 1, 1]} />;
  } catch (error) {
    console.error('Failed to load brain model:', error);
    return (
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }
};

const TestBrainLoader = () => {
  return (
    <div style={{ width: '400px', height: '400px' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        }>
          <BrainModelTest />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default TestBrainLoader;