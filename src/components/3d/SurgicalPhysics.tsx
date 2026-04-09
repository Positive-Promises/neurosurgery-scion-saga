
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, Physics, CuboidCollider } from '@react-three/rapier';
import { Group, Mesh, BufferGeometry, Color, Points, Vector3 } from 'three';

interface SurgicalTool {
  id: string;
  type: 'scalpel' | 'forceps' | 'drill' | 'suction';
  position: [number, number, number];
  rotation: [number, number, number];
}

interface SurgicalPhysicsProps {
  tools: SurgicalTool[];
  onToolInteraction: (toolId: string, targetPart: string) => void;
  enableHaptics?: boolean;
}

const SurgicalPhysics: React.FC<SurgicalPhysicsProps> = ({
  tools,
  onToolInteraction,
  enableHaptics = false
}) => {
  const [activeTools, setActiveTools] = useState<Set<string>>(new Set());
  const [tissueDeformation, setTissueDeformation] = useState<Map<string, number>>(new Map());

  // Soft tissue physics simulation
  const SoftTissue: React.FC<{ position: [number, number, number]; name: string }> = ({ position, name }) => {
    const meshRef = useRef<Mesh>(null);
    const originalPositions = useRef<Float32Array | null>(null);
    const deformationOffsets = useRef<Float32Array | null>(null);
    const deformationAmount = tissueDeformation.get(name) || 0;

    useFrame(() => {
      if (meshRef.current && deformationAmount > 0) {
        // Simulate tissue deformation
        const geometry = meshRef.current.geometry as BufferGeometry;
        const positionAttribute = geometry.getAttribute('position');
        
        if (positionAttribute) {
          const positions = positionAttribute.array as Float32Array;
          
          // Initialize cached arrays if needed
          if (!originalPositions.current) {
            originalPositions.current = new Float32Array(positions);
            deformationOffsets.current = new Float32Array(positions.length / 3);
            for (let i = 0; i < deformationOffsets.current.length; i++) {
              deformationOffsets.current[i] = Math.random();
            }
          }

          const originals = originalPositions.current;
          const offsets = deformationOffsets.current!;

          // Apply deformation relative to original state
          for (let i = 0; i < positions.length; i += 3) {
            const vertexIndex = i / 3;
            positions[i] = originals[i];
            positions[i + 1] = originals[i + 1] - deformationAmount * 0.1 * offsets[vertexIndex];
            positions[i + 2] = originals[i + 2];
          }
          
          positionAttribute.needsUpdate = true;
          geometry.computeVertexNormals();
        }
      }
    });

    return (
      <RigidBody type="fixed" colliders="trimesh">
        <mesh ref={meshRef} position={position}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="#ffaaaa" 
            transparent 
            opacity={0.8}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </RigidBody>
    );
  };

import { CollisionEnterPayload } from '@react-three/rapier';

  // Surgical tool component with physics
  const SurgicalToolMesh: React.FC<{ tool: SurgicalTool }> = ({ tool }) => {
    const [isActive, setIsActive] = useState(false);

    const handleCollision = (payload: CollisionEnterPayload) => {
      const targetName = payload.colliderObject?.name;
      if (targetName) {
        onToolInteraction(tool.id, targetName);
        
        // Simulate haptic feedback
        if (enableHaptics && navigator.vibrate) {
          navigator.vibrate(50);
        }

        // Apply tissue deformation
        setTissueDeformation(prev => new Map(prev.set(targetName, 0.5)));
        
        setIsActive(true);
        setTimeout(() => setIsActive(false), 200);
      }
    };

    return (
      <RigidBody 
        position={tool.position}
        rotation={tool.rotation}
        type="kinematicPosition"
        onCollisionEnter={handleCollision}
      >
        <CuboidCollider args={[0.1, 0.5, 0.1]} />
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial 
            color={isActive ? new Color("#ff4444") : new Color("#888888")}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </RigidBody>
    );
  };

  // Blood flow simulation
  const BloodFlow: React.FC = () => {
    const particlesRef = useRef<Points>(null);
    const particlePositions = useRef<Float32Array>(new Float32Array(300));
    const PARTICLE_COUNT = 100;

    useFrame(() => {
      if (particlesRef.current) {
        const positions = particlePositions.current;
        const now = Date.now();

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const idx = i * 3;
          // Simulate blood flow
          positions[idx + 1] -= 0.01; // y
          positions[idx] += Math.sin(now * 0.001 + i) * 0.005; // x
          
          // Reset particles when they fall too low
          if (positions[idx + 1] < -5) {
            positions[idx + 1] = 2;
            positions[idx] = (Math.random() - 0.5) * 4;
            positions[idx + 2] = (Math.random() - 0.5) * 4;
          }
        }

        const positionAttribute = particlesRef.current.geometry.getAttribute('position');
        if (positionAttribute) {
          (positionAttribute.array as Float32Array).set(positions);
          positionAttribute.needsUpdate = true;
        }
      }
    });

    // Initialize particles
    React.useEffect(() => {
      const positions = particlePositions.current;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        positions[idx] = (Math.random() - 0.5) * 4;
        positions[idx + 1] = Math.random() * 4;
        positions[idx + 2] = (Math.random() - 0.5) * 4;
      }
    }, []);

    return (
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            itemSize={3}
            array={particlePositions.current}
          />
        </bufferGeometry>
        <pointsMaterial color="#ff0000" size={0.05} />
      </points>
    );
  };

  return (
    <Physics gravity={[0, -9.81, 0]}>
      {/* Surgical tools */}
      {tools.map(tool => (
        <SurgicalToolMesh key={tool.id} tool={tool} />
      ))}

      {/* Soft tissue simulation */}
      <SoftTissue position={[0, 0, 0]} name="brain-tissue" />
      <SoftTissue position={[2, 0, 0]} name="spinal-tissue" />

      {/* Blood flow simulation */}
      <BloodFlow />

      {/* Operating table */}
      <RigidBody type="fixed">
        <CuboidCollider args={[3, 0.1, 2]} position={[0, -2, 0]} />
        <mesh position={[0, -2, 0]}>
          <boxGeometry args={[6, 0.2, 4]} />
          <meshStandardMaterial color="#cccccc" />
        </mesh>
      </RigidBody>
    </Physics>
  );
};

export default SurgicalPhysics;
