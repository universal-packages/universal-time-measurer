/**
 * Benchmark Examples
 *
 * This example demonstrates how to use the Benchmark class for performance testing,
 * including synchronous and asynchronous operations, statistical analysis, and best practices.
 */
import { Benchmark } from '../src'

// Helper function to simulate various computational tasks
function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

function bubbleSort(arr: number[]): number[] {
  const sortedArr = [...arr]
  const n = sortedArr.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (sortedArr[j] > sortedArr[j + 1]) {
        ;[sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]]
      }
    }
  }

  return sortedArr
}

async function simulateAsyncOperation(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

async function basicBenchmarkExamples() {
  console.log('=== Basic Benchmark Examples ===\n')

  // Example 1: Simple synchronous benchmark
  console.log('1. Simple synchronous benchmark:')
  const fibBenchmark = new Benchmark({
    iterations: 100,
    warmupIterations: 10,
    name: 'Fibonacci Calculation'
  })

  const fibResult = fibBenchmark.run(() => {
    fibonacci(20) // Calculate fibonacci of 20
  })

  console.log(`   Benchmark: ${fibResult.name}`)
  console.log(`   Iterations: ${fibResult.iterations}`)
  console.log(`   Warmup iterations: ${fibResult.warmupIterations}`)
  console.log(`   Average time: ${fibResult.average.toString()}`)
  console.log(`   Min time: ${fibResult.min.toString()}`)
  console.log(`   Max time: ${fibResult.max.toString()}`)
  console.log(`   Total time: ${fibResult.total.toString()}`)

  // Example 2: Array sorting benchmark
  console.log('\n2. Array sorting benchmark:')
  const sortBenchmark = new Benchmark({
    iterations: 50,
    warmupIterations: 5,
    name: 'Bubble Sort Algorithm'
  })

  const randomArray = Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000))

  const sortResult = sortBenchmark.run(() => {
    bubbleSort(randomArray)
  })

  console.log(`   ${sortResult.name} results:`)
  console.log(`   Average: ${sortResult.average.toString()}`)
  console.log(`   Range: ${sortResult.min.toString()} - ${sortResult.max.toString()}`)

  // Example 3: String operations benchmark
  console.log('\n3. String operations benchmark:')
  const stringBenchmark = new Benchmark({
    iterations: 1000,
    warmupIterations: 100,
    name: 'String Concatenation'
  })

  const words = ['hello', 'world', 'from', 'benchmark', 'test']

  const stringResult = stringBenchmark.run(() => {
    let result = ''
    for (const word of words) {
      result += word + ' '
    }
    return result.trim()
  })

  console.log(`   ${stringResult.name} (1000 iterations):`)
  console.log(`   Average: ${stringResult.average.toString()}`)
  console.log(`   Fastest: ${stringResult.min.toString()}`)
  console.log(`   Slowest: ${stringResult.max.toString()}`)
}

async function asyncBenchmarkExamples() {
  console.log('\n=== Async Benchmark Examples ===\n')

  // Example 1: Simple async operation
  console.log('1. Simple async operation benchmark:')
  const asyncBenchmark = new Benchmark({
    iterations: 20,
    warmupIterations: 3,
    name: 'Async Operation'
  })

  const asyncResult = await asyncBenchmark.runAsync(async () => {
    await simulateAsyncOperation(10) // 10ms delay
  })

  console.log(`   ${asyncResult.name} results:`)
  console.log(`   Average: ${asyncResult.average.toString()}`)
  console.log(`   Min: ${asyncResult.min.toString()}`)
  console.log(`   Max: ${asyncResult.max.toString()}`)

  // Example 2: Promise.all vs sequential execution
  console.log('\n2. Parallel vs Sequential execution comparison:')

  const parallelBenchmark = new Benchmark({
    iterations: 10,
    warmupIterations: 2,
    name: 'Parallel Promises'
  })

  const parallelResult = await parallelBenchmark.runAsync(async () => {
    await Promise.all([simulateAsyncOperation(20), simulateAsyncOperation(15), simulateAsyncOperation(25)])
  })

  const sequentialBenchmark = new Benchmark({
    iterations: 10,
    warmupIterations: 2,
    name: 'Sequential Promises'
  })

  const sequentialResult = await sequentialBenchmark.runAsync(async () => {
    await simulateAsyncOperation(20)
    await simulateAsyncOperation(15)
    await simulateAsyncOperation(25)
  })

  console.log(`   Parallel execution average: ${parallelResult.average.toString()}`)
  console.log(`   Sequential execution average: ${sequentialResult.average.toString()}`)

  const speedup = sequentialResult.average.milliseconds / parallelResult.average.milliseconds
  console.log(`   Speedup factor: ${speedup.toFixed(2)}x`)
}

async function comparativeAnalysis() {
  console.log('\n=== Comparative Analysis Examples ===\n')

  // Compare different algorithms for the same task
  console.log('1. Algorithm comparison - Array sorting:')

  // Bubble sort benchmark
  const bubbleBenchmark = new Benchmark({
    iterations: 20,
    warmupIterations: 3,
    name: 'Bubble Sort'
  })

  const testArray = Array.from({ length: 200 }, () => Math.floor(Math.random() * 1000))

  const bubbleResult = bubbleBenchmark.run(() => {
    bubbleSort(testArray)
  })

  // Native sort benchmark
  const nativeBenchmark = new Benchmark({
    iterations: 20,
    warmupIterations: 3,
    name: 'Native Sort'
  })

  const nativeResult = nativeBenchmark.run(() => {
    ;[...testArray].sort((a, b) => a - b)
  })

  console.log(`   Bubble Sort - Average: ${bubbleResult.average.toString()}`)
  console.log(`   Native Sort - Average: ${nativeResult.average.toString()}`)

  const improvement = bubbleResult.average.milliseconds / nativeResult.average.milliseconds
  console.log(`   Native sort is ${improvement.toFixed(2)}x faster`)

  // Compare JSON parsing methods
  console.log('\n2. JSON operations comparison:')
  const jsonData = {
    users: Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`
    }))
  }
  const jsonString = JSON.stringify(jsonData)

  const parseStringifyBenchmark = new Benchmark({
    iterations: 1000,
    warmupIterations: 100,
    name: 'JSON Parse + Stringify'
  })

  const parseStringifyResult = parseStringifyBenchmark.run(() => {
    const parsed = JSON.parse(jsonString)
    JSON.stringify(parsed)
  })

  const deepCloneBenchmark = new Benchmark({
    iterations: 1000,
    warmupIterations: 100,
    name: 'StructuredClone (if available)'
  })

  let deepCloneResult
  if (typeof structuredClone !== 'undefined') {
    deepCloneResult = deepCloneBenchmark.run(() => {
      structuredClone(jsonData)
    })

    console.log(`   JSON Parse/Stringify: ${parseStringifyResult.average.toString()}`)
    console.log(`   StructuredClone: ${deepCloneResult.average.toString()}`)
  } else {
    console.log(`   JSON Parse/Stringify: ${parseStringifyResult.average.toString()}`)
    console.log(`   StructuredClone: Not available in this environment`)
  }
}

async function statisticalAnalysis() {
  console.log('\n=== Statistical Analysis Examples ===\n')

  // Benchmark with more iterations to get better statistical data
  console.log('1. Statistical analysis of fibonacci calculation:')
  const statsBenchmark = new Benchmark({
    iterations: 200,
    warmupIterations: 20,
    name: 'Fibonacci Statistical Analysis'
  })

  const statsResult = statsBenchmark.run(() => {
    fibonacci(25)
  })

  console.log(`   Benchmark: ${statsResult.name}`)
  console.log(`   Total iterations: ${statsResult.iterations}`)
  console.log(`   Individual measurements: ${statsResult.measurements.length}`)

  // Calculate additional statistics
  const measurements = statsResult.measurements.map((m) => m.milliseconds)
  measurements.sort((a, b) => a - b)

  const median = measurements[Math.floor(measurements.length / 2)]
  const q1 = measurements[Math.floor(measurements.length * 0.25)]
  const q3 = measurements[Math.floor(measurements.length * 0.75)]

  console.log(`   Min: ${statsResult.min.toString()}`)
  console.log(`   Q1 (25th percentile): ${q1.toFixed(3)}ms`)
  console.log(`   Median (50th percentile): ${median.toFixed(3)}ms`)
  console.log(`   Q3 (75th percentile): ${q3.toFixed(3)}ms`)
  console.log(`   Max: ${statsResult.max.toString()}`)
  console.log(`   Average: ${statsResult.average.toString()}`)
  console.log(`   Total time: ${statsResult.total.toString()}`)

  // Calculate standard deviation
  const mean = statsResult.average.milliseconds
  const variance =
    measurements.reduce((sum, measurement) => {
      return sum + Math.pow(measurement - mean, 2)
    }, 0) / measurements.length
  const standardDeviation = Math.sqrt(variance)

  console.log(`   Standard deviation: ${standardDeviation.toFixed(3)}ms`)
  console.log(`   Coefficient of variation: ${((standardDeviation / mean) * 100).toFixed(2)}%`)

  // Detect outliers (measurements beyond 2 standard deviations)
  const outliers = measurements.filter((m) => Math.abs(m - mean) > 2 * standardDeviation)
  console.log(`   Outliers (>2σ): ${outliers.length} measurements`)
}

async function benchmarkBestPractices() {
  console.log('\n=== Benchmark Best Practices ===\n')

  console.log('1. Importance of warmup iterations:')

  // Benchmark without warmup
  const noWarmupBenchmark = new Benchmark({
    iterations: 50,
    warmupIterations: 0,
    name: 'No Warmup'
  })

  const noWarmupResult = noWarmupBenchmark.run(() => {
    fibonacci(22)
  })

  // Benchmark with warmup
  const withWarmupBenchmark = new Benchmark({
    iterations: 50,
    warmupIterations: 10,
    name: 'With Warmup'
  })

  const withWarmupResult = withWarmupBenchmark.run(() => {
    fibonacci(22)
  })

  console.log(`   Without warmup - Average: ${noWarmupResult.average.toString()}`)
  console.log(`   With warmup - Average: ${withWarmupResult.average.toString()}`)
  console.log('   Note: Warmup helps stabilize performance by allowing JIT optimization')

  console.log('\n2. Iteration count guidelines:')

  const iterationCounts = [10, 50, 100, 500]

  for (const count of iterationCounts) {
    const benchmark = new Benchmark({
      iterations: count,
      warmupIterations: Math.max(1, Math.floor(count * 0.1)),
      name: `${count} iterations`
    })

    const result = benchmark.run(() => {
      fibonacci(20)
    })

    console.log(`   ${count} iterations: Average ${result.average.toString()}, Range: ${result.min.toString()} - ${result.max.toString()}`)
  }

  console.log('   Recommendation: Use more iterations for more stable results')
}

// Run all benchmark examples
async function runAllBenchmarkExamples() {
  try {
    await basicBenchmarkExamples()
    await asyncBenchmarkExamples()
    await comparativeAnalysis()
    await statisticalAnalysis()
    await benchmarkBestPractices()

    console.log('\n✅ All benchmark examples completed successfully!')
  } catch (error) {
    console.error('❌ Error running benchmark examples:', error)
  }
}

export { runAllBenchmarkExamples }
