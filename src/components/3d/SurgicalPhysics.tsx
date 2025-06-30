
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, Physics, CuboidCollider } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

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
    const meshRef = useRef<THREE.Mesh>(null);
    const deformationAmount = tissueDeformation.get(name) || 0;

    useFrame(() => {
      if (meshRef.current && deformationAmount > 0) {
        // Simulate tissue deformation
        const geometry = meshRef.current.geometry as THREE.BufferGeometry;
        const positionAttribute = geometry.getAttribute('position');
        
        // Apply deformation based on surgical interaction
        for (let i = 0; i < positionAttribute.count; i++) {
          const vertex = new THREE.Vector3();
          vertex.fromBufferAttribute(positionAttribute, i);
          
          // Deform tissue based on tool interaction
          if (deformationAmount > 0) {
            vertex.y -= deformationAmount * 0.1 * Math.random();
          }
          
          positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        positionAttribute.needsUpdate = true;
        geometry.computeVertexNormals();
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

  // Surgical tool component with physics
  const SurgicalToolMesh: React.FC<{ tool: SurgicalTool }> = ({ tool }) => {
    const toolRef = useRef<THREE.Group>(null);
    const [isActive, setIsActive] = useState(false);

    const handleCollision = ({ target }: any) => {
      if (target.rigidBodyObject) {
        const targetName = target.rigidBodyObject.name;
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
        ref={toolRef}
        position={tool.position}
        rotation={tool.rotation}
        type="kinematicPosition"
        onCollisionEnter={handleCollision}
      >
        <CuboidCollider args={[0.1, 0.5, 0.1]} />
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial 
            color={isActive ? "#ff4444" : "#888888"}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </RigidBody>
    );
  };

  // Blood flow simulation
  const BloodFlow: React.FC = () => {
    const particlesRef = useRef<THREE.Points>(null);
    const particles = useRef<THREE.Vector3[]>([]);

    useFrame(() => {
      if (particlesRef.current) {
        particles.current.forEach((particle, index) => {
          // Simulate blood flow
          particle.y -= 0.01;
          particle.x += Math.sin(Date.now() * 0.001 + index) * 0.005;
          
          // Reset particles when they fall too low
          if (particle.y < -5) {
            particle.y = 2;
            particle.x = (Math.random() - 0.5) * 4;
            particle.z = (Math.random() - 0.5) * 4;
          }
        });

        const positions = new Float32Array(particles.current.length * 3);
        particles.current.forEach((particle, index) => {
          positions[index * 3] = particle.x;
          positions[index * 3 + 1] = particle.y;
          positions[index * 3 + 2] = particle.z;
        });

        if (particlesRef.current.geometry.attributes.position) {
          particlesRef.current.geometry.attributes.position.array = positions;
          particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }
    });

    // Initialize particles
    React.useEffect(() => {
      particles.current = Array.from({ length: 100 }, () => 
        new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          Math.random() * 4,
          (Math.random() - 0.5) * 4
        )
      );
    }, []);

    return (
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            itemSize={3}
            array={new Float32Array(300)}
          />
        </bufferGeometry>
        <pointsMaterial color="#ff0000" size={0.05} />
      </points>
    );
  };

  return (
    <Physics gravity={[0, -9.81, 0]} debug={process.env.NODE_ENV === 'development'}>
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
