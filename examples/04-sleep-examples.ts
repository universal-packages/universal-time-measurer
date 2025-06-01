/**
 * Sleep Examples
 *
 * This example demonstrates how to use the Sleep utility class for creating
 * delays in asynchronous code using human-readable time strings.
 */
import { StringValue } from 'ms'

import { Sleep, TimeMeasurer } from '../src'

async function basicSleepExamples() {
  console.log('=== Basic Sleep Examples ===\n')

  console.log('1. Basic sleep operations:')

  // Example 1: Simple millisecond delays
  console.log('   Testing millisecond delays:')

  let measurer = TimeMeasurer.start()
  await Sleep.for('100ms' as StringValue)
  let measurement = measurer.finish()
  console.log(`   Sleep.for('100ms') took: ${measurement.toString()}`)

  measurer = TimeMeasurer.start()
  await Sleep.for('250ms' as StringValue)
  measurement = measurer.finish()
  console.log(`   Sleep.for('250ms') took: ${measurement.toString()}`)

  // Example 2: Second-based delays
  console.log('\n   Testing second delays:')

  measurer = TimeMeasurer.start()
  await Sleep.for('1s' as StringValue)
  measurement = measurer.finish()
  console.log(`   Sleep.for('1s') took: ${measurement.toString()}`)

  measurer = TimeMeasurer.start()
  await Sleep.for('1.5s' as StringValue)
  measurement = measurer.finish()
  console.log(`   Sleep.for('1.5s') took: ${measurement.toString()}`)

  // Example 3: Various time formats
  console.log('\n   Testing various time formats:')

  const timeFormats: StringValue[] = ['500ms', '1s', '2000', '1.2s', '0.5s']

  for (const timeFormat of timeFormats) {
    measurer = TimeMeasurer.start()
    await Sleep.for(timeFormat)
    measurement = measurer.finish()
    console.log(`   Sleep.for('${timeFormat}') took: ${measurement.toString()}`)
  }
}

async function practicalSleepScenarios() {
  console.log('\n=== Practical Sleep Scenarios ===\n')

  // Scenario 1: Rate limiting / throttling
  console.log('1. Rate limiting simulation:')

  const apiCalls = ['GET /users', 'GET /posts', 'GET /comments', 'GET /profile']

  console.log('   Making API calls with rate limiting (200ms between calls):')
  for (let i = 0; i < apiCalls.length; i++) {
    const callMeasurer = TimeMeasurer.start()

    // Simulate API call
    console.log(`   Making call: ${apiCalls[i]}`)
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 50 + 25)) // 25-75ms API response

    const callTime = callMeasurer.finish()
    console.log(`     Response received in: ${callTime.toString()}`)

    // Rate limiting delay (except for the last call)
    if (i < apiCalls.length - 1) {
      console.log('     Waiting 200ms before next call...')
      await Sleep.for('200ms' as StringValue)
    }
  }

  // Scenario 2: Retry mechanism with exponential backoff
  console.log('\n2. Retry mechanism with exponential backoff:')

  async function simulateFailingOperation(attempt: number): Promise<boolean> {
    // Simulate operation that fails first few times
    const successRate = Math.min(0.1 + attempt * 0.2, 0.9) // Increases with attempts
    return Math.random() < successRate
  }

  const maxRetries = 5
  let attempt = 1
  let success = false

  while (attempt <= maxRetries && !success) {
    console.log(`   Attempt ${attempt}:`)

    const attemptMeasurer = TimeMeasurer.start()
    success = await simulateFailingOperation(attempt)
    const attemptTime = attemptMeasurer.finish()

    if (success) {
      console.log(`     ✅ Operation succeeded in ${attemptTime.toString()}`)
    } else {
      console.log(`     ❌ Operation failed in ${attemptTime.toString()}`)

      if (attempt < maxRetries) {
        // Exponential backoff: 2^(attempt-1) seconds
        const backoffTime = Math.pow(2, attempt - 1)
        const backoffString = `${backoffTime}s` as StringValue
        console.log(`     Waiting ${backoffString} before retry...`)
        await Sleep.for(backoffString)
      }
    }

    attempt++
  }

  if (!success) {
    console.log('   ❌ All retry attempts exhausted')
  }

  // Scenario 3: Polling with intervals
  console.log('\n3. Polling mechanism:')

  async function pollForResult(): Promise<string | null> {
    // Simulate checking for a result that becomes available after some time
    const elapsed = Date.now() - pollStartTime
    if (elapsed > 3000) {
      // Result available after 3 seconds
      return 'Operation completed successfully!'
    }
    return null
  }

  const pollStartTime = Date.now()
  let pollAttempt = 1
  let result: string | null = null

  console.log('   Starting polling for result (checking every 500ms):')

  while (!result && pollAttempt <= 10) {
    console.log(`     Poll attempt ${pollAttempt}...`)

    const pollMeasurer = TimeMeasurer.start()
    result = await pollForResult()
    const pollTime = pollMeasurer.finish()

    if (result) {
      console.log(`     ✅ ${result} (found in ${pollTime.toString()})`)
    } else {
      console.log(`     No result yet (checked in ${pollTime.toString()})`)
      if (pollAttempt < 10) {
        await Sleep.for('500ms' as StringValue)
      }
    }

    pollAttempt++
  }

  if (!result) {
    console.log('     ❌ Polling timeout reached')
  }
}

async function sleepWithMeasurementAnalysis() {
  console.log('\n=== Sleep Accuracy Analysis ===\n')

  console.log('1. Sleep accuracy measurement:')

  const testDurations: StringValue[] = ['50ms', '100ms', '250ms', '500ms', '1s']

  for (const duration of testDurations) {
    const measurements: number[] = []
    const iterations = 5

    console.log(`   Testing ${duration} (${iterations} iterations):`)

    for (let i = 0; i < iterations; i++) {
      const measurer = TimeMeasurer.start()
      await Sleep.for(duration)
      const measurement = measurer.finish()
      measurements.push(measurement.milliseconds)
      console.log(`     Iteration ${i + 1}: ${measurement.toString()}`)
    }

    // Calculate statistics
    const average = measurements.reduce((sum, val) => sum + val, 0) / measurements.length
    const min = Math.min(...measurements)
    const max = Math.max(...measurements)
    const standardDeviation = Math.sqrt(measurements.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / measurements.length)

    console.log(`     Statistics:`)
    console.log(`       Average: ${average.toFixed(3)}ms`)
    console.log(`       Range: ${min.toFixed(3)}ms - ${max.toFixed(3)}ms`)
    console.log(`       Std Dev: ${standardDeviation.toFixed(3)}ms`)
    console.log('')
  }
}

async function advancedSleepPatterns() {
  console.log('\n=== Advanced Sleep Patterns ===\n')

  // Pattern 1: Progressive delays
  console.log('1. Progressive delay pattern:')

  const baseDelay = 100 // Start with 100ms
  const steps = 5

  console.log('   Implementing progressive delays:')
  for (let i = 1; i <= steps; i++) {
    const delay = baseDelay * i // Increase delay each step
    const delayString = `${delay}ms` as StringValue

    console.log(`   Step ${i}: Waiting ${delayString}...`)

    const measurer = TimeMeasurer.start()
    await Sleep.for(delayString)
    const measurement = measurer.finish()

    console.log(`   Step ${i}: Completed in ${measurement.toString()}`)
  }

  // Pattern 2: Fibonacci delay sequence
  console.log('\n2. Fibonacci delay sequence:')

  function fibonacci(n: number): number {
    if (n <= 1) return n
    return fibonacci(n - 1) + fibonacci(n - 2)
  }

  console.log('   Implementing Fibonacci delay pattern:')
  for (let i = 1; i <= 6; i++) {
    const fibNumber = fibonacci(i)
    const delay = fibNumber * 50 // Scale fibonacci numbers
    const delayString = `${delay}ms` as StringValue

    console.log(`   Fibonacci ${i} (${fibNumber}): Waiting ${delayString}...`)

    const measurer = TimeMeasurer.start()
    await Sleep.for(delayString)
    const measurement = measurer.finish()

    console.log(`   Completed in ${measurement.toString()}`)
  }

  // Pattern 3: Random jitter delays
  console.log('\n3. Random jitter delay pattern:')

  const baseJitterDelay = 200
  const jitterRange = 100 // ±100ms

  console.log('   Implementing random jitter delays:')
  for (let i = 1; i <= 5; i++) {
    const jitter = (Math.random() - 0.5) * 2 * jitterRange // -100 to +100
    const totalDelay = Math.max(50, baseJitterDelay + jitter) // Minimum 50ms
    const delayString = `${Math.round(totalDelay)}ms` as StringValue

    console.log(`   Attempt ${i}: Waiting ${delayString} (base: ${baseJitterDelay}ms, jitter: ${jitter.toFixed(1)}ms)...`)

    const measurer = TimeMeasurer.start()
    await Sleep.for(delayString)
    const measurement = measurer.finish()

    console.log(`   Completed in ${measurement.toString()}`)
  }
}

async function sleepInConcurrentOperations() {
  console.log('\n=== Sleep in Concurrent Operations ===\n')

  // Example 1: Parallel delays
  console.log('1. Parallel sleep operations:')

  const parallelMeasurer = TimeMeasurer.start()

  const parallelPromises = [
    Sleep.for('300ms' as StringValue).then(() => console.log('   Task A completed (300ms)')),
    Sleep.for('500ms' as StringValue).then(() => console.log('   Task B completed (500ms)')),
    Sleep.for('200ms' as StringValue).then(() => console.log('   Task C completed (200ms)')),
    Sleep.for('400ms' as StringValue).then(() => console.log('   Task D completed (400ms)'))
  ]

  console.log('   Starting 4 parallel sleep operations...')
  await Promise.all(parallelPromises)

  const parallelMeasurement = parallelMeasurer.finish()
  console.log(`   All parallel operations completed in: ${parallelMeasurement.toString()}`)
  console.log('   (Should be ~500ms - the longest delay)')

  // Example 2: Sequential vs parallel comparison
  console.log('\n2. Sequential vs Parallel comparison:')

  const delays: StringValue[] = ['150ms', '200ms', '100ms', '250ms']

  // Sequential execution
  console.log('   Sequential execution:')
  const sequentialMeasurer = TimeMeasurer.start()

  for (const delay of delays) {
    await Sleep.for(delay)
    console.log(`     Completed ${delay}`)
  }

  const sequentialMeasurement = sequentialMeasurer.finish()
  console.log(`   Sequential total: ${sequentialMeasurement.toString()}`)

  // Parallel execution
  console.log('\n   Parallel execution:')
  const parallelComparisonMeasurer = TimeMeasurer.start()

  const promises = delays.map((delay) => Sleep.for(delay).then(() => console.log(`     Completed ${delay}`)))

  await Promise.all(promises)

  const parallelComparisonMeasurement = parallelComparisonMeasurer.finish()
  console.log(`   Parallel total: ${parallelComparisonMeasurement.toString()}`)

  const speedup = sequentialMeasurement.milliseconds / parallelComparisonMeasurement.milliseconds
  console.log(`   Speedup factor: ${speedup.toFixed(2)}x`)
}

async function sleepErrorHandling() {
  console.log('\n=== Sleep Error Handling ===\n')

  console.log('1. Invalid time string handling:')

  const invalidTimeStrings = ['invalid', 'abc', '', '-100ms', 'NaN']

  for (const timeString of invalidTimeStrings) {
    try {
      console.log(`   Testing invalid time string: "${timeString}"`)
      await Sleep.for(timeString as StringValue)
      console.log('     ✅ Unexpected success (this should not happen)')
    } catch (error) {
      console.log(`     ❌ Expected error: ${(error as Error).message}`)
    }
  }

  console.log('\n2. Sleep interruption and cleanup:')

  // Demonstrate that Sleep.for returns a Promise that can be handled normally
  const sleepPromise = Sleep.for('2s' as StringValue)
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), 1000))

  try {
    console.log('   Testing Promise.race with Sleep.for...')
    await Promise.race([sleepPromise, timeoutPromise])
    console.log('   ✅ Sleep completed')
  } catch (error) {
    console.log(`   ❌ Expected timeout: ${(error as Error).message}`)
  }

  console.log('\n3. Best practices:')
  console.log('   - Always use try/catch when Sleep.for might fail')
  console.log('   - Consider using Promise.race for timeouts')
  console.log('   - Use appropriate time units for readability')
  console.log('   - Remember that Sleep.for is just a Promise wrapper')
  console.log('   - Validate time strings if they come from user input')
}

// Run all Sleep examples
async function runAllSleepExamples() {
  try {
    await basicSleepExamples()
    await practicalSleepScenarios()
    await sleepWithMeasurementAnalysis()
    await advancedSleepPatterns()
    await sleepInConcurrentOperations()
    await sleepErrorHandling()

    console.log('\n✅ All Sleep examples completed successfully!')
  } catch (error) {
    console.error('❌ Error running sleep examples:', error)
  }
}

export { runAllSleepExamples }
