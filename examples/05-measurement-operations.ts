/**
 * Measurement Operations Examples
 *
 * This example demonstrates the enhanced Measurement class with arithmetic
 * operations, comparison methods, and operator overloading capabilities.
 */
import { Measurement, TimeMeasurer } from '../src'

async function runAllMeasurementExamples(): Promise<void> {
  console.log('🕒 Measurement Operations Examples\n')

  // ============================================================================
  // 1. Creating Measurements
  // ============================================================================

  console.log('📊 Creating Measurements:')
  const oneSecond = new Measurement(1000000000n) // 1 second in nanoseconds
  const twoSeconds = new Measurement(2000000000n) // 2 seconds in nanoseconds
  const halfSecond = new Measurement(500000000n) // 0.5 seconds in nanoseconds
  const quarterSecond = new Measurement(250000000n) // 0.25 seconds in nanoseconds

  console.log(`oneSecond: ${oneSecond.toString()}`)
  console.log(`twoSeconds: ${twoSeconds.toString()}`)
  console.log(`halfSecond: ${halfSecond.toString()}`)
  console.log(`quarterSecond: ${quarterSecond.toString()}\n`)

  // ============================================================================
  // 2. Arithmetic Operations
  // ============================================================================

  console.log('⚡ Arithmetic Operations:')

  // Addition
  const sum1 = oneSecond.add(halfSecond)
  console.log(`oneSecond.add(halfSecond): ${sum1.toString()}`)

  const sum2 = twoSeconds.add(quarterSecond)
  console.log(`twoSeconds.add(quarterSecond): ${sum2.toString()}`)

  // Subtraction
  const diff1 = twoSeconds.subtract(oneSecond)
  console.log(`twoSeconds.subtract(oneSecond): ${diff1.toString()}`)

  const diff2 = oneSecond.subtract(quarterSecond)
  console.log(`oneSecond.subtract(quarterSecond): ${diff2.toString()}`)

  // Subtraction with negative result (clamped to zero)
  const diff3 = quarterSecond.subtract(twoSeconds)
  console.log(`quarterSecond.subtract(twoSeconds): ${diff3.toString()} (clamped to zero)`)

  console.log()

  // ============================================================================
  // 3. Method Chaining
  // ============================================================================

  console.log('🔗 Method Chaining:')

  const chainResult1 = oneSecond.add(halfSecond).subtract(quarterSecond)
  console.log(`oneSecond.add(halfSecond).subtract(quarterSecond): ${chainResult1.toString()}`)

  const chainResult2 = twoSeconds.subtract(halfSecond).add(quarterSecond)
  console.log(`twoSeconds.subtract(halfSecond).add(quarterSecond): ${chainResult2.toString()}`)

  // Complex chaining
  const complex = oneSecond.add(twoSeconds).add(halfSecond).subtract(quarterSecond)
  console.log(`Complex chain (1s + 2s + 0.5s - 0.25s): ${complex.toString()}`)

  console.log()

  // ============================================================================
  // 4. Comparison Operations (Operator Overloading)
  // ============================================================================

  console.log('🔍 Comparison Operations (Operator Overloading):')

  console.log(`oneSecond < twoSeconds: ${oneSecond < twoSeconds}`)
  console.log(`twoSeconds > oneSecond: ${twoSeconds > oneSecond}`)
  console.log(`oneSecond <= oneSecond: ${oneSecond <= oneSecond}`)
  console.log(`halfSecond >= quarterSecond: ${halfSecond >= quarterSecond}`)
  console.log(`oneSecond == twoSeconds: ${oneSecond == twoSeconds}`)
  console.log(`oneSecond != twoSeconds: ${oneSecond != twoSeconds}`)

  console.log()

  // ============================================================================
  // 5. Explicit Comparison Methods
  // ============================================================================

  console.log('🎯 Explicit Comparison Methods:')

  // Test equality
  const anotherSecond = new Measurement(1000000000n)
  console.log(`oneSecond.equals(anotherSecond): ${oneSecond.equals(anotherSecond)}`)
  console.log(`oneSecond.equals(twoSeconds): ${oneSecond.equals(twoSeconds)}`)

  // Test less than / greater than
  console.log(`halfSecond.lessThan(oneSecond): ${halfSecond.lessThan(oneSecond)}`)
  console.log(`twoSeconds.greaterThan(halfSecond): ${twoSeconds.greaterThan(halfSecond)}`)

  // Test less than or equal / greater than or equal
  console.log(`oneSecond.lessThanOrEqual(oneSecond): ${oneSecond.lessThanOrEqual(oneSecond)}`)
  console.log(`twoSeconds.greaterThanOrEqual(oneSecond): ${twoSeconds.greaterThanOrEqual(oneSecond)}`)

  // Create equal measurements using addition
  const doubledHalf = halfSecond.add(halfSecond)
  console.log(`halfSecond.add(halfSecond).equals(oneSecond): ${doubledHalf.equals(oneSecond)}`)

  console.log()

  // ============================================================================
  // 6. Native Arithmetic (Returns Numbers)
  // ============================================================================

  console.log('🧮 Native Arithmetic Operations (Returns Numbers):')

  const numSum = Number(oneSecond) + Number(halfSecond)
  console.log(`Number(oneSecond) + Number(halfSecond): ${numSum} nanoseconds`)

  const numDiff = Number(twoSeconds) - Number(oneSecond)
  console.log(`Number(twoSeconds) - Number(oneSecond): ${numDiff} nanoseconds`)

  const numMultiple = Number(oneSecond) * 3
  console.log(`Number(oneSecond) * 3: ${numMultiple} nanoseconds`)

  console.log()

  // ============================================================================
  // 7. Type Conversions
  // ============================================================================

  console.log('🔄 Type Conversions:')

  console.log(`String(oneSecond): "${String(oneSecond)}"`)
  console.log(`Number(oneSecond): ${Number(oneSecond)}`)
  console.log(`oneSecond.nanoseconds: ${oneSecond.nanoseconds}n`)

  // Different string formats
  console.log(`oneSecond.toString('Human'): "${oneSecond.toString('Human')}"`)
  console.log(`oneSecond.toString('Condensed'): "${oneSecond.toString('Condensed')}"`)
  console.log(`oneSecond.toString('Expressive'): "${oneSecond.toString('Expressive')}"`)

  console.log()

  // ============================================================================
  // 8. Real-world Scenarios
  // ============================================================================

  console.log('🌍 Real-world Scenarios:')

  // Calculate total time for multiple operations
  const dbQuery = new Measurement(150000000n) // 150ms
  const apiCall = new Measurement(300000000n) // 300ms
  const processing = new Measurement(75000000n) // 75ms
  const rendering = new Measurement(25000000n) // 25ms

  const totalTime = dbQuery.add(apiCall).add(processing).add(rendering)
  console.log(`Total request time: ${totalTime.toString()}`)

  // Calculate if within SLA (e.g., under 600ms)
  const slaLimit = new Measurement(600000000n) // 600ms SLA
  const withinSLA = totalTime.lessThan(slaLimit)
  console.log(`Within SLA (< 600ms): ${withinSLA}`)

  // Calculate remaining time budget
  const remainingBudget = slaLimit.subtract(totalTime)
  console.log(`Remaining time budget: ${remainingBudget.toString()}`)

  console.log()

  // ============================================================================
  // 9. Working with TimeMeasurer Results
  // ============================================================================

  console.log('⏱️  Working with TimeMeasurer Results:')

  // Simulate measuring actual operations
  function simulateOperation(duration: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, duration))
  }

  // Measure first operation
  const measurer1 = TimeMeasurer.start()
  await simulateOperation(100) // 100ms
  const measurement1 = measurer1.finish()

  // Measure second operation
  const measurer2 = TimeMeasurer.start()
  await simulateOperation(150) // 150ms
  const measurement2 = measurer2.finish()

  console.log(`Operation 1: ${measurement1.toString()}`)
  console.log(`Operation 2: ${measurement2.toString()}`)

  // Compare measurements
  const faster = measurement1.lessThan(measurement2) ? measurement1 : measurement2
  const slower = measurement1.greaterThan(measurement2) ? measurement1 : measurement2

  console.log(`Faster operation: ${faster.toString()}`)
  console.log(`Slower operation: ${slower.toString()}`)

  // Calculate total and average
  const total = measurement1.add(measurement2)
  // Manual average calculation (since no divide method)
  const averageNanos = total.nanoseconds / 2n
  const average = new Measurement(averageNanos)

  console.log(`Total time: ${total.toString()}`)
  console.log(`Average time: ${average.toString()}`)

  // Calculate performance difference
  const difference = slower.subtract(faster)
  console.log(`Performance difference: ${difference.toString()}`)

  console.log('\n✅ All measurement operations examples completed!')
}

export { runAllMeasurementExamples }
