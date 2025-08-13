import * as THREE from 'three';

// A simplified path representing CSF flow through ventricles for animation purposes.
// The path starts in the lateral ventricles, goes down to the third ventricle,
// through the cerebral aqueduct to the fourth ventricle, and then out.
export const CSF_FLOW_PATH = new THREE.CatmullRomCurve3([
  // Lateral Ventricles (simplified as two lobes)
  new THREE.Vector3(-1.5, 2, 0.5),
  new THREE.Vector3(-1, 2.2, 0),
  new THREE.Vector3(0, 1.8, -0.2),
  new THREE.Vector3(1, 2.2, 0),
  new THREE.Vector3(1.5, 2, 0.5),
  new THREE.Vector3(0, 1.8, -0.2), // Loop back towards center

  // Third Ventricle
  new THREE.Vector3(0, 1.5, -0.5),
  new THREE.Vector3(0, 1.0, -0.6),

  // Cerebral Aqueduct
  new THREE.Vector3(0, 0.5, -0.8),
  new THREE.Vector3(0, 0, -1.0),

  // Fourth Ventricle
  new THREE.Vector3(0, -0.5, -1.2),
  new THREE.Vector3(0.2, -1, -1.0),
  new THREE.Vector3(-0.2, -1.2, -0.8),
  new THREE.Vector3(0, -1.5, -0.5),

  // Exit to subarachnoid space (simplified)
  new THREE.Vector3(0, -2.0, 0),
  new THREE.Vector3(1, -2.2, 1.5),
  new THREE.Vector3(-1, -2.2, 1.5),
  new THREE.Vector3(0, -2.0, 0),
]);
