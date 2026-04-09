
// Mocking the data structures
const VERTEX_COUNT = 1000;
const PARTICLE_COUNT = 100;
const ITERATIONS = 100000;

// Soft Tissue Mock Data
const softTissuePositions = new Float32Array(VERTEX_COUNT * 3).fill(0);
const deformationAmount = 0.5;

// Soft Tissue Optimized Data
const originalPositions = new Float32Array(softTissuePositions);
const deformationOffsets = new Float32Array(VERTEX_COUNT);
for (let i = 0; i < deformationOffsets.length; i++) {
  deformationOffsets[i] = Math.random();
}

// Blood Flow Mock Data
class Vector3 {
  constructor(public x: number, public y: number, public z: number) {}
}
const bloodFlowParticles = Array.from({ length: PARTICLE_COUNT }, () => new Vector3(
  (Math.random() - 0.5) * 4,
  Math.random() * 4,
  (Math.random() - 0.5) * 4
));

// Blood Flow Optimized Data
const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const idx = i * 3;
  particlePositions[idx] = (Math.random() - 0.5) * 4;
  particlePositions[idx + 1] = Math.random() * 4;
  particlePositions[idx + 2] = (Math.random() - 0.5) * 4;
}

function benchmark(name: string, fn: () => void) {
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    fn();
  }
  const end = performance.now();
  console.log(`${name}: ${(end - start).toFixed(4)}ms for ${ITERATIONS} iterations (avg: ${((end - start) * 1000 / ITERATIONS).toFixed(4)}µs/iter)`);
}

console.log("--- SoftTissue Update ---");
benchmark("current implementation (allocation-heavy)", () => {
  const positions = softTissuePositions;
  const newPositions = new Float32Array(positions.length);

  for (let i = 0; i < positions.length; i += 3) {
    newPositions[i] = positions[i];
    newPositions[i + 1] = positions[i + 1] - deformationAmount * 0.1 * Math.random();
    newPositions[i + 2] = positions[i + 2];
  }

  softTissuePositions.set(newPositions);
});

benchmark("optimized implementation (in-place, relative)", () => {
  const positions = softTissuePositions;
  const originals = originalPositions;
  const offsets = deformationOffsets;

  for (let i = 0; i < positions.length; i += 3) {
    const vertexIndex = i / 3;
    positions[i] = originals[i];
    positions[i + 1] = originals[i + 1] - deformationAmount * 0.1 * offsets[vertexIndex];
    positions[i + 2] = originals[i + 2];
  }
});

console.log("\n--- BloodFlow Update ---");
benchmark("current implementation (allocation-heavy)", () => {
  bloodFlowParticles.forEach((particle, index) => {
    particle.y -= 0.01;
    particle.x += Math.sin(Date.now() * 0.001 + index) * 0.005;

    if (particle.y < -5) {
      particle.y = 2;
      particle.x = (Math.random() - 0.5) * 4;
      particle.z = (Math.random() - 0.5) * 4;
    }
  });

  const positions = new Float32Array(bloodFlowParticles.length * 3);
  bloodFlowParticles.forEach((particle, index) => {
    positions[index * 3] = particle.x;
    positions[index * 3 + 1] = particle.y;
    positions[index * 3 + 2] = particle.z;
  });
});

benchmark("optimized implementation (pre-allocated buffer)", () => {
  const positions = particlePositions;
  const now = Date.now();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const idx = i * 3;
    positions[idx + 1] -= 0.01;
    positions[idx] += Math.sin(now * 0.001 + i) * 0.005;

    if (positions[idx + 1] < -5) {
      positions[idx + 1] = 2;
      positions[idx] = (Math.random() - 0.5) * 4;
      positions[idx + 2] = (Math.random() - 0.5) * 4;
    }
  }
});
