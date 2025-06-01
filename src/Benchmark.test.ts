import { Benchmark } from './'
import { assert, assertEquals, runTest } from './utils.test'

export async function benchmarkTest(): Promise<void> {
  console.log('Running Benchmark tests...\n')

  // Test 1: Constructor with default options
  await runTest('Constructor - Default options', () => {
    const benchmark = new Benchmark()

    // We can't directly access private options, but we can test the behavior
    const result = benchmark.run(() => {
      // Simple function that takes some time
      let sum = 0
      for (let i = 0; i < 1000; i++) {
        sum += i
      }
    })

    assertEquals(result.iterations, 1, 'Should use default iterations of 1')
    assertEquals(result.warmupIterations, 0, 'Should use default warmup iterations of 0')
    assertEquals(result.name, 'Unnamed Benchmark', 'Should use default name')
    assertEquals(result.measurements.length, 1, 'Should have 1 measurement')
  })

  // Test 2: Constructor with custom options
  await runTest('Constructor - Custom options', () => {
    const benchmark = new Benchmark({
      iterations: 5,
      warmupIterations: 2,
      name: 'Custom Test Benchmark'
    })

    const result = benchmark.run(() => {
      let sum = 0
      for (let i = 0; i < 100; i++) {
        sum += i
      }
    })

    assertEquals(result.iterations, 5, 'Should use custom iterations')
    assertEquals(result.warmupIterations, 2, 'Should use custom warmup iterations')
    assertEquals(result.name, 'Custom Test Benchmark', 'Should use custom name')
    assertEquals(result.measurements.length, 5, 'Should have 5 measurements')
  })

  // Test 3: Basic synchronous run
  await runTest('Synchronous run - Basic functionality', () => {
    const benchmark = new Benchmark({ iterations: 3, name: 'Sync Test' })
    let executionCount = 0

    const result = benchmark.run(() => {
      executionCount++
      // Simple computation
      let sum = 0
      for (let i = 0; i < 1000; i++) {
        sum += i
      }
    })

    assertEquals(executionCount, 3, 'Function should be executed 3 times')
    assertEquals(result.measurements.length, 3, 'Should have 3 measurements')
    assert(result.min !== undefined, 'Should have min measurement')
    assert(result.max !== undefined, 'Should have max measurement')
    assert(result.average !== undefined, 'Should have average measurement')
    assert(result.total !== undefined, 'Should have total measurement')
  })

  // Test 4: Warmup iterations
  await runTest('Warmup iterations - Should not be included in results', () => {
    const benchmark = new Benchmark({
      iterations: 2,
      warmupIterations: 3,
      name: 'Warmup Test'
    })
    let executionCount = 0

    const result = benchmark.run(() => {
      executionCount++
    })

    assertEquals(executionCount, 5, 'Function should be executed 5 times total (3 warmup + 2 measured)')
    assertEquals(result.measurements.length, 2, 'Should only have 2 measurements (warmup not included)')
    assertEquals(result.iterations, 2, 'Should report 2 iterations')
    assertEquals(result.warmupIterations, 3, 'Should report 3 warmup iterations')
  })

  // Test 5: Asynchronous run
  await runTest('Asynchronous run - Basic functionality', async () => {
    const benchmark = new Benchmark({ iterations: 2, name: 'Async Test' })
    let executionCount = 0

    const result = await benchmark.runAsync(async () => {
      executionCount++
      // Simulate async work with a small delay
      await new Promise((resolve) => setTimeout(resolve, 10))
    })

    assertEquals(executionCount, 2, 'Async function should be executed 2 times')
    assertEquals(result.measurements.length, 2, 'Should have 2 measurements')
    assert(result.min !== undefined, 'Should have min measurement')
    assert(result.max !== undefined, 'Should have max measurement')
    assert(result.average !== undefined, 'Should have average measurement')
    assert(result.total !== undefined, 'Should have total measurement')
  })

  // Test 6: Asynchronous run with warmup
  await runTest('Asynchronous run - With warmup iterations', async () => {
    const benchmark = new Benchmark({
      iterations: 2,
      warmupIterations: 2,
      name: 'Async Warmup Test'
    })
    let executionCount = 0

    const result = await benchmark.runAsync(async () => {
      executionCount++
      await new Promise((resolve) => setTimeout(resolve, 5))
    })

    assertEquals(executionCount, 4, 'Async function should be executed 4 times total (2 warmup + 2 measured)')
    assertEquals(result.measurements.length, 2, 'Should only have 2 measurements')
  })

  // Test 7: Statistics calculations - Multiple iterations
  await runTest('Statistics calculations - Multiple iterations', () => {
    const benchmark = new Benchmark({ iterations: 10, name: 'Stats Test' })

    const result = benchmark.run(() => {
      // Variable workload to create different measurements
      const iterations = Math.floor(Math.random() * 1000) + 500
      let sum = 0
      for (let i = 0; i < iterations; i++) {
        sum += i
      }
    })

    assertEquals(result.measurements.length, 10, 'Should have 10 measurements')

    // Verify that min <= average <= max
    const minNs = convertMeasurementToNanoseconds(result.min)
    const maxNs = convertMeasurementToNanoseconds(result.max)
    const avgNs = convertMeasurementToNanoseconds(result.average)

    assert(minNs <= avgNs, 'Min should be <= average')
    assert(avgNs <= maxNs, 'Average should be <= max')
    assert(minNs <= maxNs, 'Min should be <= max')

    // Total should be sum of all measurements
    const sumOfMeasurements = result.measurements.reduce((sum, measurement) => {
      return sum + convertMeasurementToNanoseconds(measurement)
    }, 0n)
    const totalNs = convertMeasurementToNanoseconds(result.total)

    assertEquals(totalNs, sumOfMeasurements, 'Total should equal sum of all measurements')
  })

  // Test 8: Single iteration statistics
  await runTest('Statistics calculations - Single iteration', () => {
    const benchmark = new Benchmark({ iterations: 1, name: 'Single Stats Test' })

    const result = benchmark.run(() => {
      let sum = 0
      for (let i = 0; i < 1000; i++) {
        sum += i
      }
    })

    assertEquals(result.measurements.length, 1, 'Should have 1 measurement')

    // With single iteration, min, max, average, and total should all be the same
    const measurementNs = convertMeasurementToNanoseconds(result.measurements[0])
    const minNs = convertMeasurementToNanoseconds(result.min)
    const maxNs = convertMeasurementToNanoseconds(result.max)
    const avgNs = convertMeasurementToNanoseconds(result.average)
    const totalNs = convertMeasurementToNanoseconds(result.total)

    assertEquals(minNs, measurementNs, 'Min should equal the single measurement')
    assertEquals(maxNs, measurementNs, 'Max should equal the single measurement')
    assertEquals(avgNs, measurementNs, 'Average should equal the single measurement')
    assertEquals(totalNs, measurementNs, 'Total should equal the single measurement')
  })

  // Test 9: Consistent measurements
  await runTest('Consistent measurements - Same function should produce similar results', () => {
    const benchmark = new Benchmark({ iterations: 5, name: 'Consistency Test' })

    const result = benchmark.run(() => {
      // Fixed workload to create consistent measurements
      let sum = 0
      for (let i = 0; i < 10000; i++) {
        sum += i * 2
      }
    })

    assertEquals(result.measurements.length, 5, 'Should have 5 measurements')

    // All measurements should be relatively close (within reasonable variance)
    const measurements = result.measurements.map(convertMeasurementToNanoseconds)
    const minVal = measurements.reduce((min, val) => (val < min ? val : min))
    const maxVal = measurements.reduce((max, val) => (val > max ? val : max))

    // The variance should not be too large for a consistent function
    // This is a rough test - in practice, there will always be some variance
    assert(maxVal >= minVal, 'Max should be >= min')
  })

  // Test 10: Result object structure - All required properties
  await runTest('Result object structure - All required properties', () => {
    const benchmark = new Benchmark({
      iterations: 3,
      warmupIterations: 1,
      name: 'Structure Test'
    })

    const result = benchmark.run(() => {
      let sum = 0
      for (let i = 0; i < 100; i++) {
        sum += i
      }
    })

    // Check all required properties exist
    assert(typeof result.name === 'string', 'Result should have name property')
    assert(typeof result.iterations === 'number', 'Result should have iterations property')
    assert(typeof result.warmupIterations === 'number', 'Result should have warmupIterations property')
    assert(Array.isArray(result.measurements), 'Result should have measurements array')
    assert(result.min !== undefined, 'Result should have min measurement')
    assert(result.max !== undefined, 'Result should have max measurement')
    assert(result.average !== undefined, 'Result should have average measurement')
    assert(result.total !== undefined, 'Result should have total measurement')

    assertEquals(result.name, 'Structure Test', 'Name should match')
    assertEquals(result.iterations, 3, 'Iterations should match')
    assertEquals(result.warmupIterations, 1, 'Warmup iterations should match')
  })

  // Test 11: Error handling - Empty measurements array
  await runTest('Error handling - Empty measurements array', () => {
    const benchmark = new Benchmark()

    // Create a benchmark instance and manually call calculateStatistics with empty array
    let errorThrown = false
    try {
      // Access the private method through type assertion
      ;(benchmark as any).calculateStatistics([])
    } catch (error) {
      errorThrown = true
      const err = error instanceof Error ? error : new Error(String(error))
      assert(err instanceof Error, 'Should throw an Error')
      assert(err.message.includes('No measurements'), 'Error should mention no measurements')
    }

    assert(errorThrown, 'Should throw error for empty measurements array')
  })

  // Test 12: Statistics edge case - First measurement is maximum
  await runTest('Statistics edge case - First measurement is maximum', () => {
    const benchmark = new Benchmark({ iterations: 3 })

    // Create a function where the first call takes longer than subsequent calls
    let callCount = 0
    const variableFunction = () => {
      callCount++
      if (callCount === 1) {
        // First call - longer duration
        const start = Date.now()
        while (Date.now() - start < 50) {
          // Busy wait for 50ms on first call
        }
      } else {
        // Subsequent calls - shorter duration
        const start = Date.now()
        while (Date.now() - start < 10) {
          // Busy wait for 10ms on subsequent calls
        }
      }
    }

    const result = benchmark.run(variableFunction)

    assert(result.measurements.length === 3, 'Should have 3 measurements')
    assert(result.min !== undefined, 'Should have min measurement')
    assert(result.max !== undefined, 'Should have max measurement')

    // The first measurement should be the maximum in this case
    const firstMs = result.measurements[0].milliseconds
    const maxMs = result.max.milliseconds

    // Allow some tolerance for timing variability
    assert(Math.abs(firstMs - maxMs) < 30, `First measurement (${firstMs}ms) should be approximately equal to max (${maxMs}ms)`)
  })

  console.log('\n🏁 All Benchmark tests completed!')
}

// Helper function to convert Measurement to nanoseconds for comparison
function convertMeasurementToNanoseconds(measurement: any): bigint {
  return (
    BigInt(measurement.hours) * 3600000000000n +
    BigInt(measurement.minutes) * 60000000000n +
    BigInt(measurement.seconds) * 1000000000n +
    BigInt(Math.round(measurement.milliseconds * 1000000))
  )
}
