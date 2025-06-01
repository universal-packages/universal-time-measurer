import { Sleep } from './'
import { assert, assertEquals, runTest } from './utils.test'

export async function sleepTest(): Promise<void> {
  console.log('Running Sleep tests...\n')

  // Test 1: Basic milliseconds sleep
  await runTest('Basic milliseconds sleep', async () => {
    const startTime = Date.now()
    await Sleep.for('100ms')
    const endTime = Date.now()
    const actualDuration = endTime - startTime

    // Allow some tolerance for timing (±20ms)
    assert(actualDuration >= 80, `Should sleep at least 80ms, got ${actualDuration}ms`)
    assert(actualDuration <= 150, `Should sleep at most 150ms, got ${actualDuration}ms`)
  })

  // Test 2: Seconds format
  await runTest('Seconds format', async () => {
    const startTime = Date.now()
    await Sleep.for('0.1s')
    const endTime = Date.now()
    const actualDuration = endTime - startTime

    // 0.1s = 100ms, allow ±20ms tolerance
    assert(actualDuration >= 80, `Should sleep at least 80ms, got ${actualDuration}ms`)
    assert(actualDuration <= 150, `Should sleep at most 150ms, got ${actualDuration}ms`)
  })

  // Test 3: Different time format variations
  await runTest('Different time format variations', async () => {
    // Test various formats supported by the ms library
    const formats = [
      { input: '50', expected: 50 }, // Plain number (ms)
      { input: '75ms', expected: 75 }, // Milliseconds
      { input: '0.05s', expected: 50 }, // Decimal seconds
      { input: '1 second', expected: 1000 } // Long form
    ]

    for (const format of formats) {
      const startTime = Date.now()
      await Sleep.for(format.input as any)
      const endTime = Date.now()
      const actualDuration = endTime - startTime
      const expectedMin = Math.max(format.expected - 20, 0)
      const expectedMax = format.expected + 50 // More generous upper bound

      assert(actualDuration >= expectedMin, `Format '${format.input}': Should sleep at least ${expectedMin}ms, got ${actualDuration}ms`)
      assert(actualDuration <= expectedMax, `Format '${format.input}': Should sleep at most ${expectedMax}ms, got ${actualDuration}ms`)
    }
  })

  // Test 4: Return type verification
  await runTest('Return type verification', async () => {
    const result = Sleep.for('10ms')

    assert(result instanceof Promise, 'Should return a Promise')

    const resolvedValue = await result
    assertEquals(resolvedValue, undefined, 'Promise should resolve to undefined')
  })

  // Test 5: Zero duration
  await runTest('Zero duration', async () => {
    const startTime = Date.now()
    await Sleep.for('0ms')
    const endTime = Date.now()
    const actualDuration = endTime - startTime

    // Even 0ms should complete very quickly (under 10ms)
    assert(actualDuration < 10, `Zero duration should complete quickly, got ${actualDuration}ms`)
  })

  // Test 6: Concurrent sleeps
  await runTest('Concurrent sleeps', async () => {
    const startTime = Date.now()

    // Start multiple sleeps concurrently
    const sleep1 = Sleep.for('50ms')
    const sleep2 = Sleep.for('75ms')
    const sleep3 = Sleep.for('25ms')

    // Wait for all to complete
    await Promise.all([sleep1, sleep2, sleep3])

    const endTime = Date.now()
    const totalDuration = endTime - startTime

    // Should complete in about 75ms (the longest sleep), not 150ms (sum)
    assert(totalDuration >= 50, `Concurrent sleeps should take at least 50ms, got ${totalDuration}ms`)
    assert(totalDuration <= 120, `Concurrent sleeps should complete in ~75ms, got ${totalDuration}ms`)
  })

  // Test 7: Sequential sleeps
  await runTest('Sequential sleeps', async () => {
    const startTime = Date.now()

    await Sleep.for('30ms')
    await Sleep.for('30ms')
    await Sleep.for('30ms')

    const endTime = Date.now()
    const totalDuration = endTime - startTime

    // Should take about 90ms total (30ms × 3)
    assert(totalDuration >= 70, `Sequential sleeps should take at least 70ms, got ${totalDuration}ms`)
    assert(totalDuration <= 150, `Sequential sleeps should take at most 150ms, got ${totalDuration}ms`)
  })

  // Test 8: Longer durations
  await runTest('Longer durations', async () => {
    const startTime = Date.now()
    await Sleep.for('200ms')
    const endTime = Date.now()
    const actualDuration = endTime - startTime

    // Allow ±30ms tolerance for longer durations
    assert(actualDuration >= 170, `Should sleep at least 170ms, got ${actualDuration}ms`)
    assert(actualDuration <= 250, `Should sleep at most 250ms, got ${actualDuration}ms`)
  })

  // Test 9: Promise chaining
  await runTest('Promise chaining', async () => {
    const startTime = Date.now()
    let intermediateTime = 0

    await Sleep.for('50ms').then(() => {
      intermediateTime = Date.now()
      return Sleep.for('50ms')
    })

    const endTime = Date.now()
    const firstDuration = intermediateTime - startTime
    const totalDuration = endTime - startTime

    assert(firstDuration >= 30, `First sleep should be at least 30ms, got ${firstDuration}ms`)
    assert(firstDuration <= 80, `First sleep should be at most 80ms, got ${firstDuration}ms`)
    assert(totalDuration >= 80, `Total duration should be at least 80ms, got ${totalDuration}ms`)
    assert(totalDuration <= 150, `Total duration should be at most 150ms, got ${totalDuration}ms`)
  })

  // Test 10: Static method verification
  await runTest('Static method verification', () => {
    // Verify that 'for' is a static method
    assert(typeof Sleep.for === 'function', 'Sleep.for should be a function')

    // Verify we cannot call it on an instance (should throw)
    const sleepInstance = new Sleep()
    assert((sleepInstance as any).for === undefined, 'Instance should not have for method')

    // Verify the method exists on the class constructor
    assert(Sleep.hasOwnProperty('for'), 'Sleep class should have static for method')
  })

  // Test 11: String parsing edge cases
  await runTest('String parsing edge cases', async () => {
    // Test that the ms library parsing works correctly
    const testCases = ['100ms', '0.1s', '0.1 sec', '0.1 second']

    for (const testCase of testCases) {
      const startTime = Date.now()
      await Sleep.for(testCase as any)
      const endTime = Date.now()
      const duration = endTime - startTime

      // All should be approximately 100ms
      assert(duration >= 70, `Format '${testCase}' should sleep at least 70ms, got ${duration}ms`)
      assert(duration <= 150, `Format '${testCase}' should sleep at most 150ms, got ${duration}ms`)
    }
  })

  // Test 12: Very short duration precision
  await runTest('Very short duration precision', async () => {
    const startTime = Date.now()
    await Sleep.for('1ms')
    const endTime = Date.now()
    const actualDuration = endTime - startTime

    // Very short sleeps might not be perfectly accurate due to system limitations
    // Just verify it completes quickly (under 20ms)
    assert(actualDuration >= 0, 'Duration should be non-negative')
    assert(actualDuration <= 20, `Very short sleep should complete quickly, got ${actualDuration}ms`)
  })

  console.log('\n🏁 All Sleep tests completed!')
}
