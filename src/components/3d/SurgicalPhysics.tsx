
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
    const deformationAmount = tissueDeformation.get(name) || 0;
    // Reusable buffer to avoid per-frame allocation
    const deformationBuffer = useRef<Float32Array | null>(null);

    useFrame(() => {
      if (meshRef.current && deformationAmount > 0) {
        // Simulate tissue deformation
        const geometry = meshRef.current.geometry as BufferGeometry;
        const positionAttribute = geometry.getAttribute('position');
        
        // Apply deformation based on surgical interaction
        if (positionAttribute && deformationAmount > 0) {
          const positions = positionAttribute.array as Float32Array;

          // Ensure buffer exists and is the correct size
          if (!deformationBuffer.current || deformationBuffer.current.length !== positions.length) {
            deformationBuffer.current = new Float32Array(positions.length);
          }

          const newPositions = deformationBuffer.current;
          
          for (let i = 0; i < positions.length; i += 3) {
            newPositions[i] = positions[i];
            newPositions[i + 1] = positions[i + 1] - deformationAmount * 0.1 * Math.random();
            newPositions[i + 2] = positions[i + 2];
          }
          
          // Use direct array assignment instead of copyArray
          (positionAttribute.array as Float32Array).set(newPositions);
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
  const BloodFlow: React.FC<{ count?: number }> = ({ count = 100 }) => {
    const particlesRef = useRef<Points>(null);
    // Store particle data in a single Float32Array [x, y, z, x, y, z, ...]
    const particlesData = useRef<Float32Array | null>(null);

    // Handle initialization and dynamic resizing of particle count
    if (!particlesData.current || particlesData.current.length !== count * 3) {
      particlesData.current = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        particlesData.current[idx] = (Math.random() - 0.5) * 4;
        particlesData.current[idx + 1] = Math.random() * 4;
        particlesData.current[idx + 2] = (Math.random() - 0.5) * 4;
      }
    }

    useFrame((state) => {
      if (particlesRef.current && particlesData.current) {
        const data = particlesData.current;
        const time = state.clock.getElapsedTime();

        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          // Simulate blood flow
          data[idx + 1] -= 0.01; // y
          data[idx] += Math.sin(time + i) * 0.005; // x
          
          // Reset particles when they fall too low
          if (data[idx + 1] < -5) {
            data[idx + 1] = 2;
            data[idx] = (Math.random() - 0.5) * 4;
            data[idx + 2] = (Math.random() - 0.5) * 4;
          }
        }

        const positionAttribute = particlesRef.current.geometry.getAttribute('position');
        if (positionAttribute && positionAttribute.array.length === data.length) {
          // Update the attribute array directly from our particlesData
          (positionAttribute.array as Float32Array).set(data);
          positionAttribute.needsUpdate = true;
        }
      }
    });


    return (
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            itemSize={3}
            array={new Float32Array(count * 3)}
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
