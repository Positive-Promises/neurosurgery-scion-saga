import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CSF_FLOW_PATH } from '@/data/csfFlowPath';

const PARTICLE_COUNT = 150;
const PARTICLE_SPEED = 0.03;

const CSFSystem: React.FC = () => {
  const particlesRef = useRef<THREE.InstancedMesh>(null);

  // Initialize particles with random starting positions along the path
  const initialData = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      data.push({
        progress: Math.random(), // Start at a random point on the curve
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.getElapsedTime();

    initialData.forEach((data, i) => {
      // Update progress
      data.progress = (data.progress + PARTICLE_SPEED * 0.01) % 1;

      // Get position on the curve
      const position = CSF_FLOW_PATH.getPointAt(data.progress);
      dummy.position.copy(position);

      // Add a little bit of random drift for a more fluid look
      dummy.position.x += (Math.sin(time * 0.5 + i) * 0.05);
      dummy.position.y += (Math.cos(time * 0.4 + i) * 0.05);
      dummy.position.z += (Math.sin(time * 0.6 + i) * 0.05);

      // Update the instance matrix
      dummy.updateMatrix();
      particlesRef.current!.setMatrixAt(i, dummy.matrix);
    });

    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* The visible path for debugging/visualization */}
      <line loop>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={CSF_FLOW_PATH.points.length}
            array={new THREE.Float32BufferAttribute(
              CSF_FLOW_PATH.points.flatMap(p => p.toArray()),
              3
            )}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#00ffff" transparent opacity={0.3} />
      </line>

      {/* The CSF particles */}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#87ceeb" emissive="#00ffff" emissiveIntensity={1} transparent opacity={0.8} />
      </instancedMesh>
    </>
  );
};

export default CSFSystem;
