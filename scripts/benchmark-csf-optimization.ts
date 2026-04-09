
/**
 * Benchmark script to compare different ways of creating a Float32Array from an array of Vector3-like objects.
 */

interface Vector3Like {
  x: number;
  y: number;
  z: number;
  toArray(): [number, number, number];
}

const createMockPoints = (count: number): Vector3Like[] => {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: Math.random(),
    toArray() {
      return [this.x, this.y, this.z];
    },
  }));
};

const ITERATIONS = 10000;
const POINT_COUNT = 18; // Based on CSF_FLOW_PATH.points.length in the actual code

const points = createMockPoints(POINT_COUNT);

function benchmark(name: string, fn: () => void) {
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    fn();
  }
  const end = performance.now();
  console.log(`${name}: ${(end - start).toFixed(4)}ms (total for ${ITERATIONS} iterations)`);
  return end - start;
}

console.log(`Benchmarking with ${POINT_COUNT} points over ${ITERATIONS} iterations...\n`);

const flatMapTime = benchmark("Current (flatMap)", () => {
  new Float32Array(points.flatMap(p => p.toArray()));
});

const optimizedLoopTime = benchmark("Optimized (Manual Loop)", () => {
  const array = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    array[i * 3] = p.x;
    array[i * 3 + 1] = p.y;
    array[i * 3 + 2] = p.z;
  }
});

const improvement = ((flatMapTime - optimizedLoopTime) / flatMapTime * 100).toFixed(2);
console.log(`\nImprovement: ${improvement}%`);
