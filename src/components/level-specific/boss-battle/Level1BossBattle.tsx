import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { GameErrorBoundary } from '@/components/game/GameErrorBoundary';
import RealisticBrainModel from '@/components/3d/RealisticBrainModel';

const TIMER_SECONDS = 60;

// Placeholder for the surgical tool
const SurgicalTool = React.forwardRef<THREE.Mesh>((props, ref) => {
  return (
    <mesh ref={ref} position={[0, 0, 5]}>
      <coneGeometry args={[0.05, 0.5, 8]} />
      <meshStandardMaterial color="silver" emissive="gray" metalness={0.8} roughness={0.2} />
    </mesh>
  );
});

// Placeholder for the target area in the third ventricle
const VentricleTarget = () => {
  return (
    <mesh position={[0, 1.0, -0.6]} visible={false}>
      <sphereGeometry args={[0.2, 16, 16]} />
    </mesh>
  );
};

const PressureGauge: React.FC<{ pressure: number }> = ({ pressure }) => {
  const color = pressure > 85 ? 'red' : pressure > 60 ? 'orange' : 'green';
  return (
    <div className="absolute top-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg w-64">
      <h3 className="text-white font-bold mb-2">ICP Monitor</h3>
      <div className="w-full bg-gray-600 rounded-full h-4">
        <div
          className="h-4 rounded-full transition-all duration-200"
          style={{ width: `${pressure}%`, backgroundColor: color }}
        ></div>
      </div>
      <p className="text-white text-center mt-1">{Math.round(pressure)} mmHg</p>
    </div>
  );
};


interface Level1BossBattleProps {
  onWin: () => void;
  onLoss: () => void;
}

const Gameplay: React.FC<Level1BossBattleProps> = ({ onWin, onLoss }) => {
    const [pressure, setPressure] = useState(20);
    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
    const toolRef = useRef<THREE.Mesh>(null);
    const targetRef = useRef<THREE.Mesh>(null);

    // Game loop for pressure and timer
    useFrame((_, delta) => {
      setPressure(p => Math.min(100, p + delta * 2)); // Pressure increases over time
      setTimeLeft(t => Math.max(0, t - delta));

      if (pressure >= 100 || timeLeft <= 0) {
        onLoss();
      }
    });

    // Simple keyboard controls for the tool
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!toolRef.current) return;
            const speed = 0.1;
            switch(e.key) {
                case 'w': toolRef.current.position.y += speed; break;
                case 's': toolRef.current.position.y -= speed; break;
                case 'a': toolRef.current.position.x -= speed; break;
                case 'd': toolRef.current.position.x += speed; break;
                case 'q': toolRef.current.position.z -= speed; break;
                case 'e': toolRef.current.position.z += speed; break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleProcedure = () => {
      if (toolRef.current && targetRef.current) {
        const distance = toolRef.current.position.distanceTo(targetRef.current.position);
        if (distance < 0.2) {
          onWin();
        } else {
          // Maybe provide feedback that the user missed
        }
      }
    };

    return (
      <>
        <Suspense fallback={null}>
            <group opacity={0.1}>
                <RealisticBrainModel onRegionClick={() => {}} onRegionHover={() => {}} labeledRegions={new Set()} />
            </group>
            <SurgicalTool ref={toolRef} />
            <VentricleTarget />
            <mesh ref={targetRef} position={[0, 1.0, -0.6]} visible={false}>
                <sphereGeometry args={[0.2, 16, 16]} />
            </mesh>
        </Suspense>
        <OrbitControls enabled={false} />
        <Text position={[0, 0, 0]} fontSize={0.3} color="red" anchorX="center">
            TIMER: {Math.ceil(timeLeft)}s
        </Text>
        <Html>
            <div className="absolute top-4 left-4">
                <button onClick={handleProcedure} className="px-4 py-2 bg-blue-500 text-white rounded">Perform ETV</button>
            </div>
            <PressureGauge pressure={pressure} />
        </Html>
      </>
    );
  };


const Level1BossBattle: React.FC<Level1BossBattleProps> = ({ onWin, onLoss }) => {
  return (
    <GameErrorBoundary>
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Gameplay onWin={onWin} onLoss={onLoss} />
      </Canvas>
    </GameErrorBoundary>
  );
};

export default Level1BossBattle;
