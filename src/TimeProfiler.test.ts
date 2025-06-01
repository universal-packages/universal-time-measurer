import { TimeProfiler } from './'
import { assert, assertEquals, runTest } from './utils.test'

export async function timeProfilerTest(): Promise<void> {
  console.log('Running TimeProfiler tests...\n')

  // Test 1: Constructor with default options
  await runTest('Constructor - Default options', () => {
    const profiler = new TimeProfiler()

    assertEquals(profiler.options.name, 'Profiler Session', 'Should use default name')
    assertEquals(profiler.options.trackMemory, false, 'Should not track memory by default')
    assertEquals(profiler.isRunning, false, 'Should not be running initially')
    assertEquals(profiler.checkpoints.length, 0, 'Should have no checkpoints initially')
    assertEquals(profiler.lastCheckpoint, undefined, 'Should have no last checkpoint initially')
    assertEquals(profiler.elapsed, undefined, 'Should have no elapsed time when not started')
  })

  // Test 2: Constructor with custom options
  await runTest('Constructor - Custom options', () => {
    const profiler = new TimeProfiler({
      name: 'Custom Profiler Session',
      trackMemory: true
    })

    assertEquals(profiler.options.name, 'Custom Profiler Session', 'Should use custom name')
    assertEquals(profiler.options.trackMemory, true, 'Should track memory when enabled')
    assertEquals(profiler.isRunning, false, 'Should not be running initially')
  })

  // Test 3: Basic start and stop functionality
  await runTest('Basic start and stop functionality', () => {
    const profiler = new TimeProfiler({ name: 'Start Stop Test' })

    // Test start
    profiler.start()
    assertEquals(profiler.isRunning, true, 'Should be running after start')
    assert(profiler.elapsed !== undefined, 'Should have elapsed time after start')

    // Test stop
    const checkpoints = profiler.stop()
    assertEquals(profiler.isRunning, false, 'Should not be running after stop')
    assertEquals(checkpoints.length, 1, 'Should have final checkpoint after stop')
    assertEquals(checkpoints[0].name, 'Final', 'Should have default final checkpoint name')
  })

  // Test 4: Custom final checkpoint name
  await runTest('Custom final checkpoint name', () => {
    const profiler = new TimeProfiler()
    profiler.start()

    const checkpoints = profiler.stop('Custom Final')
    assertEquals(checkpoints[0].name, 'Custom Final', 'Should use custom final checkpoint name')
  })

  // Test 5: Multiple checkpoints
  await runTest('Multiple checkpoints', async () => {
    const profiler = new TimeProfiler({ name: 'Checkpoint Test' })
    profiler.start()

    // Add some delay and create checkpoints
    const measurement1 = profiler.checkpoint('Checkpoint 1')

    // Small delay
    await new Promise((resolve) => setTimeout(resolve, 10))

    const measurement2 = profiler.checkpoint('Checkpoint 2')

    await new Promise((resolve) => setTimeout(resolve, 10))

    const checkpoints = profiler.stop('End')

    assertEquals(checkpoints.length, 3, 'Should have 3 checkpoints (2 manual + 1 final)')
    assertEquals(checkpoints[0].name, 'Checkpoint 1', 'First checkpoint should have correct name')
    assertEquals(checkpoints[1].name, 'Checkpoint 2', 'Second checkpoint should have correct name')
    assertEquals(checkpoints[2].name, 'End', 'Final checkpoint should have correct name')

    // Verify measurements are increasing
    const cp1Time = convertMeasurementToNanoseconds(checkpoints[0].measurement)
    const cp2Time = convertMeasurementToNanoseconds(checkpoints[1].measurement)
    const cp3Time = convertMeasurementToNanoseconds(checkpoints[2].measurement)

    assert(cp1Time <= cp2Time, 'Checkpoint 2 should be >= Checkpoint 1')
    assert(cp2Time <= cp3Time, 'Final checkpoint should be >= Checkpoint 2')

    // Verify returned measurements match checkpoint measurements
    assertEquals(convertMeasurementToNanoseconds(measurement1), cp1Time, 'Returned measurement should match checkpoint')
    assertEquals(convertMeasurementToNanoseconds(measurement2), cp2Time, 'Returned measurement should match checkpoint')
  })

  // Test 6: getCheckpoint method
  await runTest('getCheckpoint method', () => {
    const profiler = new TimeProfiler()
    profiler.start()

    profiler.checkpoint('Test Checkpoint')
    profiler.checkpoint('Another Checkpoint')

    const found = profiler.getCheckpoint('Test Checkpoint')
    const notFound = profiler.getCheckpoint('Nonexistent')

    assert(found !== undefined, 'Should find existing checkpoint')
    assertEquals(found!.name, 'Test Checkpoint', 'Should return correct checkpoint')
    assertEquals(notFound, undefined, 'Should return undefined for nonexistent checkpoint')

    profiler.stop()
  })

  // Test 7: lastCheckpoint property
  await runTest('lastCheckpoint property', () => {
    const profiler = new TimeProfiler()

    assertEquals(profiler.lastCheckpoint, undefined, 'Should be undefined when no checkpoints')

    profiler.start()
    assertEquals(profiler.lastCheckpoint, undefined, 'Should be undefined after start but before checkpoints')

    profiler.checkpoint('First')
    assertEquals(profiler.lastCheckpoint!.name, 'First', 'Should return first checkpoint')

    profiler.checkpoint('Second')
    assertEquals(profiler.lastCheckpoint!.name, 'Second', 'Should return most recent checkpoint')

    profiler.stop('Final')
    assertEquals(profiler.lastCheckpoint!.name, 'Final', 'Should return final checkpoint after stop')
  })

  // Test 8: Memory tracking
  await runTest('Memory tracking', () => {
    const profiler = new TimeProfiler({ trackMemory: true })
    profiler.start()

    const checkpoint1 = profiler.checkpoint('Memory Test 1')
    const checkpoint2 = profiler.checkpoint('Memory Test 2')

    const checkpoints = profiler.stop()

    // Check that memory properties exist when tracking is enabled
    assert(checkpoints[0].memoryUsage !== undefined, 'First checkpoint should have memory usage')
    assert(checkpoints[0].memoryDelta !== undefined, 'First checkpoint should have memory delta')
    assert(checkpoints[1].memoryUsage !== undefined, 'Second checkpoint should have memory usage')
    assert(checkpoints[1].memoryDelta !== undefined, 'Second checkpoint should have memory delta')
    assert(checkpoints[2].memoryUsage !== undefined, 'Final checkpoint should have memory usage')
    assert(checkpoints[2].memoryDelta !== undefined, 'Final checkpoint should have memory delta')

    // First checkpoint should have delta 0
    assertEquals(checkpoints[0].memoryDelta, 0, 'First checkpoint should have memory delta of 0')
  })

  // Test 9: Memory tracking disabled
  await runTest('Memory tracking disabled', () => {
    const profiler = new TimeProfiler({ trackMemory: false })
    profiler.start()

    const checkpoints = profiler.stop('No Memory')

    // Check that memory properties don't exist when tracking is disabled
    assertEquals(checkpoints[0].memoryUsage, undefined, 'Should not have memory usage when disabled')
    assertEquals(checkpoints[0].memoryDelta, undefined, 'Should not have memory delta when disabled')
  })

  // Test 10: Reset functionality
  await runTest('Reset functionality', () => {
    const profiler = new TimeProfiler()
    profiler.start()
    profiler.checkpoint('Before Reset')

    assertEquals(profiler.isRunning, true, 'Should be running before reset')
    assertEquals(profiler.checkpoints.length, 1, 'Should have checkpoint before reset')

    profiler.reset()

    assertEquals(profiler.isRunning, false, 'Should not be running after reset')
    assertEquals(profiler.checkpoints.length, 0, 'Should have no checkpoints after reset')
    assertEquals(profiler.lastCheckpoint, undefined, 'Should have no last checkpoint after reset')
    assertEquals(profiler.elapsed, undefined, 'Should have no elapsed time after reset')
  })

  // Test 11: Error handling - Double start
  await runTest('Error handling - Double start', () => {
    const profiler = new TimeProfiler()
    profiler.start()

    let errorThrown = false
    try {
      profiler.start()
    } catch (error) {
      errorThrown = true
      const err = error instanceof Error ? error : new Error(String(error))
      assert(err instanceof Error, 'Should throw an Error')
      assert(err.message.includes('already started'), 'Error should mention already started')
    }

    assert(errorThrown, 'Should throw error on double start')
    profiler.stop()
  })

  // Test 12: Error handling - Checkpoint without start
  await runTest('Error handling - Checkpoint without start', () => {
    const profiler = new TimeProfiler()

    let errorThrown = false
    try {
      profiler.checkpoint('Invalid')
    } catch (error) {
      errorThrown = true
      const err = error instanceof Error ? error : new Error(String(error))
      assert(err instanceof Error, 'Should throw an Error')
      assert(err.message.includes('not started'), 'Error should mention not started')
    }

    assert(errorThrown, 'Should throw error when checkpointing without start')
  })

  // Test 13: Error handling - Stop without start
  await runTest('Error handling - Stop without start', () => {
    const profiler = new TimeProfiler()

    let errorThrown = false
    try {
      profiler.stop()
    } catch (error) {
      errorThrown = true
      const err = error instanceof Error ? error : new Error(String(error))
      assert(err instanceof Error, 'Should throw an Error')
      assert(err.message.includes('not started'), 'Error should mention not started')
    }

    assert(errorThrown, 'Should throw error when stopping without start')
  })

  // Test 14: Static start method
  await runTest('Static start method', () => {
    const profiler = TimeProfiler.start('Static Test')

    assertEquals(profiler.options.name, 'Static Test', 'Should use provided name')
    assertEquals(profiler.isRunning, true, 'Should be auto-started')
    assert(profiler.elapsed !== undefined, 'Should have elapsed time')

    profiler.stop()
  })

  // Test 15: Static start method with default name
  await runTest('Static start method with default name', () => {
    const profiler = TimeProfiler.start()

    assertEquals(profiler.options.name, undefined, 'Should be undefined when no name provided to static method')
    assertEquals(profiler.isRunning, true, 'Should be auto-started')

    profiler.stop()
  })

  // Test 16: Checkpoint timestamps
  await runTest('Checkpoint timestamps', async () => {
    const startTime = new Date()
    const profiler = new TimeProfiler()
    profiler.start()

    await new Promise((resolve) => setTimeout(resolve, 10))

    const checkpoints = profiler.stop()
    const endTime = new Date()

    assertEquals(checkpoints.length, 1, 'Should have one checkpoint')
    assert(checkpoints[0].timestamp instanceof Date, 'Checkpoint should have timestamp')
    assert(checkpoints[0].timestamp >= startTime, 'Timestamp should be after start time')
    assert(checkpoints[0].timestamp <= endTime, 'Timestamp should be before end time')
  })

  // Test 17: Checkpoints array immutability
  await runTest('Checkpoints array immutability', () => {
    const profiler = new TimeProfiler()
    profiler.start()
    profiler.checkpoint('Test')

    const checkpoints1 = profiler.checkpoints
    const checkpoints2 = profiler.checkpoints

    // Should return different array instances (copies)
    assert(checkpoints1 !== checkpoints2, 'Should return different array instances')
    assertEquals(checkpoints1.length, checkpoints2.length, 'Arrays should have same content')
    assertEquals(checkpoints1[0].name, checkpoints2[0].name, 'Array contents should be the same')

    // Modifying returned array should not affect internal state
    checkpoints1.push({} as any)
    const checkpoints3 = profiler.checkpoints
    assertEquals(checkpoints3.length, 1, 'Internal state should not be affected by external modifications')

    profiler.stop()
  })

  // Test 18: Performance.now fallback in elapsed getter
  await runTest('Performance.now fallback in elapsed getter', () => {
    const profiler = new TimeProfiler()

    // Mock process to be undefined to force performance.now() path
    const originalProcess = global.process
    ;(global as any).process = undefined

    try {
      profiler.start()

      const elapsed = profiler.elapsed

      assert(elapsed !== undefined, 'Should return elapsed time using performance.now fallback')
      assert(elapsed!.milliseconds >= 0, 'Should have non-negative elapsed time')

      profiler.stop()
    } finally {
      // Restore process
      ;(global as any).process = originalProcess
    }
  })

  // Test 19: Performance.now fallback in checkpoint
  await runTest('Performance.now fallback in checkpoint', () => {
    const profiler = new TimeProfiler()

    // Mock process to be undefined to force performance.now() path
    const originalProcess = global.process
    ;(global as any).process = undefined

    try {
      profiler.start()

      const measurement = profiler.checkpoint('Performance Test')

      assert(measurement !== undefined, 'Should return measurement using performance.now fallback')
      assert(measurement.milliseconds >= 0, 'Should have non-negative milliseconds')

      profiler.stop()
    } finally {
      // Restore process
      ;(global as any).process = originalProcess
    }
  })

  // Test 20: Memory tracking with browser memory API fallback
  await runTest('Memory tracking with browser memory API fallback', () => {
    const profiler = new TimeProfiler({ trackMemory: true })

    // Mock process to be undefined and add performance.memory
    const originalProcess = global.process
    const originalPerformance = global.performance

    ;(global as any).process = undefined
    ;(global as any).performance = {
      now: originalPerformance ? originalPerformance.now.bind(originalPerformance) : () => Date.now(),
      memory: {
        usedJSHeapSize: 1000000
      }
    }

    try {
      profiler.start()

      const checkpoints = profiler.stop('Browser Memory Test')

      assert(checkpoints[0].memoryUsage !== undefined, 'Should have memory usage from browser API')
      assertEquals(checkpoints[0].memoryUsage, 1000000, 'Should use browser memory API value')
    } finally {
      // Restore globals
      ;(global as any).process = originalProcess
      ;(global as any).performance = originalPerformance
    }
  })

  // Test 21: Memory tracking fallback when no memory API available
  await runTest('Memory tracking fallback when no memory API available', () => {
    const profiler = new TimeProfiler({ trackMemory: true })

    // Mock both process and performance to be undefined
    const originalProcess = global.process
    const originalPerformance = global.performance

    ;(global as any).process = undefined
    ;(global as any).performance = {
      now: originalPerformance ? originalPerformance.now.bind(originalPerformance) : () => Date.now()
      // No memory property
    }

    try {
      profiler.start()

      const checkpoints = profiler.stop('No Memory API Test')

      assert(checkpoints[0].memoryUsage !== undefined, 'Should have memory usage property')
      assertEquals(checkpoints[0].memoryUsage, 0, 'Should fallback to 0 when no memory API available')
    } finally {
      // Restore globals
      ;(global as any).process = originalProcess
      ;(global as any).performance = originalPerformance
    }
  })

  // Test 22: Memory tracking with falsy usedJSHeapSize
  await runTest('Memory tracking with falsy usedJSHeapSize', () => {
    const profiler = new TimeProfiler({ trackMemory: true })

    // Mock process to be undefined and add performance.memory with falsy usedJSHeapSize
    const originalProcess = global.process
    const originalPerformance = global.performance

    ;(global as any).process = undefined
    ;(global as any).performance = {
      now: originalPerformance ? originalPerformance.now.bind(originalPerformance) : () => Date.now(),
      memory: {
        usedJSHeapSize: 0 // Falsy but defined
      }
    }

    try {
      profiler.start()

      const checkpoints = profiler.stop('Falsy Memory Test')

      assert(checkpoints[0].memoryUsage !== undefined, 'Should have memory usage property')
      assertEquals(checkpoints[0].memoryUsage, 0, 'Should use the falsy value (0) from usedJSHeapSize')
    } finally {
      // Restore globals
      ;(global as any).process = originalProcess
      ;(global as any).performance = originalPerformance
    }
  })

  console.log('\n🏁 All TimeProfiler tests completed!')
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
