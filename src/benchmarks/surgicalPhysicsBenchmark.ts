
function benchmark(name: string, fn: () => void, iterations: number = 10000) {
    // Warm up
    for (let i = 0; i < 100; i++) fn();

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    const end = performance.now();
    const totalTime = end - start;
    const avgTime = totalTime / iterations;

    console.log(`${name}:`);
    console.log(`  Total time for ${iterations} iterations: ${totalTime.toFixed(4)}ms`);
    console.log(`  Average time per iteration: ${avgTime.toFixed(6)}ms`);

    // Check GC impact roughly by looking at memory usage if possible
    // Note: this is very rough in JS environment
    if (typeof process !== 'undefined' && process.memoryUsage) {
        const mem = process.memoryUsage();
        console.log(`  Memory Usage (heapUsed): ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    }
}

// Simulation of current BloodFlow logic
const numParticles = 100;
const particlesObj = Array.from({ length: numParticles }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: Math.random()
}));

function currentBloodFlowLoop() {
    // 1. Simulate update
    particlesObj.forEach((p, index) => {
        p.y -= 0.01;
        p.x += Math.sin(Date.now() * 0.001 + index) * 0.005;
        if (p.y < -5) p.y = 2;
    });

    // 2. Allocation (The issue)
    const positions = new Float32Array(particlesObj.length * 3);

    // 3. Copy
    particlesObj.forEach((p, index) => {
        positions[index * 3] = p.x;
        positions[index * 3 + 1] = p.y;
        positions[index * 3 + 2] = p.z;
    });

    // 4. Simulate attribute update
    // (In reality this would be attribute.set(positions))
    const fakeAttributeArray = new Float32Array(numParticles * 3);
    fakeAttributeArray.set(positions);
}

// Simulation of optimized BloodFlow logic
const particlesFloat32 = new Float32Array(numParticles * 3);
for(let i=0; i<numParticles*3; i++) particlesFloat32[i] = Math.random();
const reusablePositions = new Float32Array(numParticles * 3);

function optimizedBloodFlowLoop() {
    // 1. Update in place
    for (let i = 0; i < numParticles; i++) {
        const idx = i * 3;
        particlesFloat32[idx + 1] -= 0.01; // y
        particlesFloat32[idx] += Math.sin(Date.now() * 0.001 + i) * 0.005; // x
        if (particlesFloat32[idx + 1] < -5) particlesFloat32[idx + 1] = 2;
    }

    // No allocation!

    // 2. Simulate attribute update
    // (In reality we might even update the attribute array directly)
    const fakeAttributeArray = new Float32Array(numParticles * 3);
    fakeAttributeArray.set(particlesFloat32);
}

// SoftTissue Simulation
const numVertices = 3000; // SphereGeometry(1, 32, 32) has roughly 3000 vertices (32*32*3 is approx 3072)
const tissuePositions = new Float32Array(numVertices * 3);
for(let i=0; i<tissuePositions.length; i++) tissuePositions[i] = Math.random();

function currentSoftTissueLoop() {
    const deformationAmount = 0.5;
    const positions = tissuePositions; // In Three.js this is positionAttribute.array

    // Allocation (The issue)
    const newPositions = new Float32Array(positions.length);

    for (let i = 0; i < positions.length; i += 3) {
        newPositions[i] = positions[i];
        newPositions[i + 1] = positions[i + 1] - deformationAmount * 0.1 * Math.random();
        newPositions[i + 2] = positions[i + 2];
    }

    // Use direct array assignment instead of copyArray
    const fakeAttributeArray = new Float32Array(positions.length);
    fakeAttributeArray.set(newPositions);
}

const optimizedNewPositions = new Float32Array(numVertices * 3);
function optimizedSoftTissueLoop() {
    const deformationAmount = 0.5;
    const positions = tissuePositions;

    // Reuse pre-allocated buffer
    const newPositions = optimizedNewPositions;

    for (let i = 0; i < positions.length; i += 3) {
        newPositions[i] = positions[i];
        newPositions[i + 1] = positions[i + 1] - deformationAmount * 0.1 * Math.random();
        newPositions[i + 2] = positions[i + 2];
    }

    const fakeAttributeArray = new Float32Array(positions.length);
    fakeAttributeArray.set(newPositions);
}

console.log("--- BloodFlow Performance ---");
benchmark("Current BloodFlow", currentBloodFlowLoop);
benchmark("Optimized BloodFlow", optimizedBloodFlowLoop);

console.log("\n--- SoftTissue Performance ---");
benchmark("Current SoftTissue", currentSoftTissueLoop, 1000); // Fewer iterations as it's heavier
benchmark("Optimized SoftTissue", optimizedSoftTissueLoop, 1000);
