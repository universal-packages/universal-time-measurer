import { TimeMeasurer } from './'
import { assert, assertEquals, runTest } from './utils.test'

export async function timeMeasurerTest(): Promise<void> {
  console.log('Running TimeMeasurer tests...\n')

  // Test 1: Static start method
  await runTest('Static start method', () => {
    const measurer = TimeMeasurer.start()

    assert(measurer instanceof TimeMeasurer, 'Should return TimeMeasurer instance')

    // Should be able to finish immediately after static start
    const measurement = measurer.finish()
    assert(measurement !== undefined, 'Should return a measurement')
  })

  // Test 2: Instance start and finish
  await runTest('Instance start and finish', async () => {
    const measurer = new TimeMeasurer()

    measurer.start()

    // Add small delay
    await new Promise((resolve) => setTimeout(resolve, 10))

    const measurement = measurer.finish()

    assert(measurement !== undefined, 'Should return a measurement')
    assert(typeof measurement.milliseconds === 'number', 'Should have milliseconds property')
  })

  // Test 3: Error handling - Double start
  await runTest('Error handling - Double start', () => {
    const measurer = new TimeMeasurer()

    measurer.start()

    let errorThrown = false
    try {
      measurer.start()
    } catch (error) {
      errorThrown = true
      const err = error instanceof Error ? error : new Error(String(error))
      assert(err instanceof Error, 'Should throw an Error')
      assert(err.message.includes('already started'), 'Error should mention already started')
    }

    assert(errorThrown, 'Should throw error on double start')

    // Clean up
    measurer.finish()
  })

  // Test 4: Error handling - Start after hrStart is set
  await runTest('Error handling - Start when hrStart already set', () => {
    const measurer = new TimeMeasurer()

    // Manually set hrStart to simulate the condition
    ;(measurer as any).hrStart = 1n

    let errorThrown = false
    try {
      measurer.start()
    } catch (error) {
      errorThrown = true
      const err = error instanceof Error ? error : new Error(String(error))
      assert(err instanceof Error, 'Should throw an Error')
      assert(err.message.includes('already started'), 'Error should mention already started')
    }

    assert(errorThrown, 'Should throw error when hrStart is already set')
  })

  // Test 5: Error handling - Start when startTime is set
  await runTest('Error handling - Start when startTime already set', () => {
    const measurer = new TimeMeasurer()

    // Manually set startTime to simulate the condition
    ;(measurer as any).startTime = 100

    let errorThrown = false
    try {
      measurer.start()
    } catch (error) {
      errorThrown = true
      const err = error instanceof Error ? error : new Error(String(error))
      assert(err instanceof Error, 'Should throw an Error')
      assert(err.message.includes('already started'), 'Error should mention already started')
    }

    assert(errorThrown, 'Should throw error when startTime is already set')
  })

  // Test 6: Performance.now() fallback path
  await runTest('Performance.now fallback path', () => {
    const measurer = new TimeMeasurer()

    // Mock process to be undefined to force performance.now() path
    const originalProcess = global.process
    ;(global as any).process = undefined

    try {
      measurer.start()

      // Small delay
      const start = Date.now()
      while (Date.now() - start < 10) {
        // Busy wait for 10ms
      }

      const measurement = measurer.finish()

      assert(measurement !== undefined, 'Should return measurement using performance.now fallback')
      assert(measurement.milliseconds >= 0, 'Should have non-negative milliseconds')
    } finally {
      // Restore process
      ;(global as any).process = originalProcess
    }
  })

  // Test 7: hrtime.bigint() path
  await runTest('hrtime.bigint path', () => {
    const measurer = new TimeMeasurer()

    // Ensure process.hrtime exists (should be the case in Node.js)
    if (typeof process !== 'undefined' && process.hrtime && typeof process.hrtime.bigint === 'function') {
      measurer.start()

      // Small delay
      const start = Date.now()
      while (Date.now() - start < 10) {
        // Busy wait for 10ms
      }

      const measurement = measurer.finish()

      assert(measurement !== undefined, 'Should return measurement using hrtime.bigint')
      assert(measurement.milliseconds >= 0, 'Should have non-negative milliseconds')
    }
  })

  // Test 8: Finish with performance.now() fallback
  await runTest('Finish with performance.now fallback', () => {
    const measurer = new TimeMeasurer()

    // Mock process to be undefined to force performance.now() path
    const originalProcess = global.process
    ;(global as any).process = undefined

    try {
      // Manually set startTime since start() would also need process
      ;(measurer as any).startTime = performance.now()

      // Small delay
      const start = Date.now()
      while (Date.now() - start < 10) {
        // Busy wait for 10ms
      }

      const measurement = measurer.finish()

      assert(measurement !== undefined, 'Should return measurement using performance.now in finish')
      assert(measurement.milliseconds >= 0, 'Should have non-negative milliseconds')
    } finally {
      // Restore process
      ;(global as any).process = originalProcess
    }
  })

  // Test 9: Multiple instances independence
  await runTest('Multiple instances independence', async () => {
    const measurer1 = new TimeMeasurer()
    const measurer2 = new TimeMeasurer()

    measurer1.start()

    await new Promise((resolve) => setTimeout(resolve, 10))

    measurer2.start()

    await new Promise((resolve) => setTimeout(resolve, 10))

    const measurement1 = measurer1.finish()
    const measurement2 = measurer2.finish()

    assert(measurement1 !== undefined, 'First measurer should return measurement')
    assert(measurement2 !== undefined, 'Second measurer should return measurement')

    // First measurement should be longer than second
    const ms1 = measurement1.milliseconds
    const ms2 = measurement2.milliseconds

    assert(ms1 > ms2, `First measurement (${ms1}ms) should be longer than second (${ms2}ms)`)
  })

  // Test 10: Timing accuracy
  await runTest('Timing accuracy', async () => {
    const measurer = TimeMeasurer.start()

    const expectedDuration = 50
    await new Promise((resolve) => setTimeout(resolve, expectedDuration))

    const measurement = measurer.finish()
    const actualDuration = measurement.milliseconds

    // Allow reasonable tolerance (±30ms)
    assert(actualDuration >= expectedDuration - 30, `Actual duration (${actualDuration}ms) should be at least ${expectedDuration - 30}ms`)
    assert(actualDuration <= expectedDuration + 30, `Actual duration (${actualDuration}ms) should be at most ${expectedDuration + 30}ms`)
  })

  console.log('\n🏁 All TimeMeasurer tests completed!')
}
