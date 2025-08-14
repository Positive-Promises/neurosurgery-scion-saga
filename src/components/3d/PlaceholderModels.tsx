
import React from 'react';
import * as THREE from 'three';

// Placeholder 3D models for when GLB files aren't available
export const BrainModel: React.FC<{ interactive?: boolean; onInteraction?: (partName: string) => void }> = ({ 
  interactive = true, 
  onInteraction 
}) => {
  const handleClick = (partName: string) => {
    if (interactive && onInteraction) {
      onInteraction(partName);
    }
  };

  return (
    <group>
      {/* Main brain structure */}
      <mesh 
        position={[0, 0, 0]} 
        onClick={() => handleClick('cerebrum')}
        name="cerebrum"
      >
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial 
          color="#ffaaaa" 
          transparent={true}
          opacity={0.8}
          roughness={0.6}
        />
      </mesh>
      
      {/* Brain stem */}
      <mesh 
        position={[0, -1.2, 0]} 
        onClick={() => handleClick('brainstem')}
        name="brainstem"
      >
        <cylinderGeometry args={[0.3, 0.4, 0.8]} />
        <meshStandardMaterial color="#ff9999" />
      </mesh>
      
      {/* Cerebellum */}
      <mesh 
        position={[0, -0.8, -0.8]} 
        onClick={() => handleClick('cerebellum')}
        name="cerebellum"
      >
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#ffbbbb" />
      </mesh>
      
      {/* Frontal lobe markers */}
      <mesh 
        position={[0.8, 0.3, 0.8]} 
        onClick={() => handleClick('frontal-lobe')}
        name="frontal-lobe"
      >
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#ff6666" />
      </mesh>
      
      <mesh 
        position={[-0.8, 0.3, 0.8]} 
        onClick={() => handleClick('frontal-lobe')}
        name="frontal-lobe"
      >
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#ff6666" />
      </mesh>
    </group>
  );
};

export const SpineModel: React.FC<{ interactive?: boolean; onInteraction?: (partName: string) => void }> = ({ 
  interactive = true, 
  onInteraction 
}) => {
  const handleClick = (partName: string) => {
    if (interactive && onInteraction) {
      onInteraction(partName);
    }
  };

  return (
    <group>
      {/* Vertebrae */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh 
          key={i}
          position={[0, 2 - i * 0.4, 0]} 
          onClick={() => handleClick(`vertebra-${i + 1}`)}
          name={`vertebra-${i + 1}`}
        >
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#eeeeee" />
        </mesh>
      ))}
      
      {/* Spinal cord */}
      <mesh 
        position={[0, 0.6, 0]} 
        onClick={() => handleClick('spinal-cord')}
        name="spinal-cord"
      >
        <cylinderGeometry args={[0.15, 0.15, 3]} />
        <meshStandardMaterial 
          color="#ffdddd" 
          transparent={true}
          opacity={0.7}
        />
      </mesh>
      
      {/* Nerve roots */}
      {Array.from({ length: 6 }, (_, i) => (
        <group key={i}>
          <mesh 
            position={[0.4, 1.8 - i * 0.4, 0]} 
            rotation={[0, 0, Math.PI / 4]}
            onClick={() => handleClick(`nerve-root-${i + 1}`)}
            name={`nerve-root-${i + 1}`}
          >
            <cylinderGeometry args={[0.05, 0.05, 0.6]} />
            <meshStandardMaterial color="#ffff99" />
          </mesh>
          <mesh 
            position={[-0.4, 1.8 - i * 0.4, 0]} 
            rotation={[0, 0, -Math.PI / 4]}
            onClick={() => handleClick(`nerve-root-${i + 1}`)}
            name={`nerve-root-${i + 1}`}
          >
            <cylinderGeometry args={[0.05, 0.05, 0.6]} />
            <meshStandardMaterial color="#ffff99" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const DefaultAnatomyModel: React.FC<{ interactive?: boolean; onInteraction?: (partName: string) => void }> = ({ 
  interactive = true, 
  onInteraction 
}) => {
  const handleClick = (partName: string) => {
    if (interactive && onInteraction) {
      onInteraction(partName);
    }
  };

  return (
    <group>
      <mesh 
        position={[0, 0, 0]} 
        onClick={() => handleClick('anatomy-structure')}
        name="anatomy-structure"
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#4a90e2" 
          wireframe={false}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      <mesh 
        position={[0, 0, 0]} 
        onClick={() => handleClick('anatomy-wireframe')}
        name="anatomy-wireframe"
      >
        <boxGeometry args={[2.1, 2.1, 2.1]} />
        <meshBasicMaterial 
          color="#ffffff" 
          wireframe={true}
        />
      </mesh>
    </group>
  );
};
