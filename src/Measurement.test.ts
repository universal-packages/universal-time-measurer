import { Measurement } from './'
import { assertEquals, runTest } from './utils.test'

export async function measurementTest(): Promise<void> {
  console.log('Running Measurement tests...\n')

  // Test 1: Constructor with basic time conversions
  await runTest('Constructor - Basic nanoseconds to time components', () => {
    // 1 hour = 3,600,000,000,000 nanoseconds
    const measurement1 = new Measurement(3600000000000n)
    assertEquals(measurement1.hours, 1, 'Should convert 1 hour correctly')
    assertEquals(measurement1.minutes, 0, 'Minutes should be 0')
    assertEquals(measurement1.seconds, 0, 'Seconds should be 0')
    assertEquals(measurement1.milliseconds, 0, 'Milliseconds should be 0')

    // 1 minute = 60,000,000,000 nanoseconds
    const measurement2 = new Measurement(60000000000n)
    assertEquals(measurement2.hours, 0, 'Hours should be 0')
    assertEquals(measurement2.minutes, 1, 'Should convert 1 minute correctly')
    assertEquals(measurement2.seconds, 0, 'Seconds should be 0')
    assertEquals(measurement2.milliseconds, 0, 'Milliseconds should be 0')

    // 1 second = 1,000,000,000 nanoseconds
    const measurement3 = new Measurement(1000000000n)
    assertEquals(measurement3.hours, 0, 'Hours should be 0')
    assertEquals(measurement3.minutes, 0, 'Minutes should be 0')
    assertEquals(measurement3.seconds, 1, 'Should convert 1 second correctly')
    assertEquals(measurement3.milliseconds, 0, 'Milliseconds should be 0')

    // 1 millisecond = 1,000,000 nanoseconds
    const measurement4 = new Measurement(1000000n)
    assertEquals(measurement4.hours, 0, 'Hours should be 0')
    assertEquals(measurement4.minutes, 0, 'Minutes should be 0')
    assertEquals(measurement4.seconds, 0, 'Seconds should be 0')
    assertEquals(measurement4.milliseconds, 1, 'Should convert 1 millisecond correctly')
  })

  // Test 2: Constructor with complex time combinations
  await runTest('Constructor - Complex time combinations', () => {
    // 1 hour, 30 minutes, 45 seconds, 500 milliseconds
    const totalNanoseconds = 3600000000000n + 1800000000000n + 45000000000n + 500000000n
    const measurement = new Measurement(totalNanoseconds)

    assertEquals(measurement.hours, 1, 'Should have 1 hour')
    assertEquals(measurement.minutes, 30, 'Should have 30 minutes')
    assertEquals(measurement.seconds, 45, 'Should have 45 seconds')
    assertEquals(measurement.milliseconds, 500, 'Should have 500 milliseconds')
  })

  // Test 3: toString with 'Human' format (default)
  await runTest('toString - Human format (default)', () => {
    const measurement1 = new Measurement(3665500000000n) // 1h 1m 5.5s
    assertEquals(measurement1.toString(), '1hrs 1min 5.500sec', 'Human format with hours')
    assertEquals(measurement1.toString('Human'), '1hrs 1min 5.500sec', 'Explicit Human format with hours')

    const measurement2 = new Measurement(65500000000n) // 1m 5.5s
    assertEquals(measurement2.toString('Human'), '1min 5.500sec', 'Human format with minutes')

    const measurement3 = new Measurement(5500000000n) // 5.5s
    assertEquals(measurement3.toString('Human'), '5.500sec', 'Human format with seconds only')

    const measurement4 = new Measurement(500000000n) // 500ms
    assertEquals(measurement4.toString('Human'), '500.00ms', 'Human format with milliseconds only')
  })

  // Test 4: toString with 'Condensed' format
  await runTest('toString - Condensed format', () => {
    const measurement1 = new Measurement(3665500000000n) // 1h 1m 5.5s
    assertEquals(measurement1.toString('Condensed'), '01:01:05.500', 'Condensed format with hours')

    const measurement2 = new Measurement(65500000000n) // 1m 5.5s
    assertEquals(measurement2.toString('Condensed'), '01:05.500', 'Condensed format with minutes')

    const measurement3 = new Measurement(5500000000n) // 5.5s
    assertEquals(measurement3.toString('Condensed'), '5.500', 'Condensed format with seconds only')

    const measurement4 = new Measurement(500000000n) // 500ms
    assertEquals(measurement4.toString('Condensed'), '500.00', 'Condensed format with milliseconds only')
  })

  // Test 5: toString with 'Expressive' format
  await runTest('toString - Expressive format', () => {
    const measurement1 = new Measurement(3665500000000n) // 1h 1m 5.5s
    assertEquals(measurement1.toString('Expressive'), '1 Hours, 1 Minutes, and 5.500 Seconds', 'Expressive format with hours')

    const measurement2 = new Measurement(65500000000n) // 1m 5.5s
    assertEquals(measurement2.toString('Expressive'), '1 Minutes, and 5.500 Seconds', 'Expressive format with minutes')

    const measurement3 = new Measurement(5500000000n) // 5.5s
    assertEquals(measurement3.toString('Expressive'), '5.500 Seconds', 'Expressive format with seconds only')

    const measurement4 = new Measurement(500000000n) // 500ms
    assertEquals(measurement4.toString('Expressive'), '500.00 Milliseconds', 'Expressive format with milliseconds only')
  })

  // Test 6: toDate method
  await runTest('toDate method', () => {
    const measurement = new Measurement(3665500000000n) // 1h 1m 5.5s
    const date = measurement.toDate()

    assertEquals(date.getHours(), 1, 'Date should have correct hours')
    assertEquals(date.getMinutes(), 1, 'Date should have correct minutes')
    assertEquals(date.getSeconds(), 5, 'Date should have correct seconds')
    assertEquals(date.getMilliseconds(), 500, 'Date should have correct milliseconds')
  })

  // Test 7: Edge cases - Zero values
  await runTest('Edge cases - Zero nanoseconds', () => {
    const measurement = new Measurement(0n)
    assertEquals(measurement.hours, 0, 'Hours should be 0')
    assertEquals(measurement.minutes, 0, 'Minutes should be 0')
    assertEquals(measurement.seconds, 0, 'Seconds should be 0')
    assertEquals(measurement.milliseconds, 0, 'Milliseconds should be 0')
    assertEquals(measurement.toString('Human'), '0.00ms', 'Human format for zero time')
    assertEquals(measurement.toString('Condensed'), '0.00', 'Condensed format for zero time')
    assertEquals(measurement.toString('Expressive'), '0.00 Milliseconds', 'Expressive format for zero time')
  })

  // Test 8: Edge cases - Large values
  await runTest('Edge cases - Large nanosecond values', () => {
    // 25 hours, 70 minutes, 130 seconds = should normalize to 26h 12m 10s
    const largeNanoseconds = 25n * 3600000000000n + 70n * 60000000000n + 130n * 1000000000n
    const measurement = new Measurement(largeNanoseconds)

    assertEquals(measurement.hours, 26, 'Should handle large hours correctly')
    assertEquals(measurement.minutes, 12, 'Should handle overflow minutes correctly')
    assertEquals(measurement.seconds, 10, 'Should handle overflow seconds correctly')
  })

  // Test 9: Precision test - Small nanosecond values
  await runTest('Precision - Small nanosecond values', () => {
    // Test with fractional milliseconds
    const measurement1 = new Measurement(1500000n) // 1.5 milliseconds
    assertEquals(measurement1.milliseconds, 1.5, 'Should handle fractional milliseconds')

    const measurement2 = new Measurement(100000n) // 0.1 milliseconds
    assertEquals(measurement2.milliseconds, 0.1, 'Should handle small fractional milliseconds')
  })

  // Test 10: Consistency test - Convert back and forth
  await runTest('Consistency - Nanoseconds to components and back', () => {
    const originalNanoseconds = 3665500000000n // 1h 1m 5.5s
    const measurement = new Measurement(originalNanoseconds)

    // Calculate nanoseconds from components
    const calculatedNanoseconds =
      BigInt(measurement.hours) * 3600000000000n +
      BigInt(measurement.minutes) * 60000000000n +
      BigInt(measurement.seconds) * 1000000000n +
      BigInt(Math.round(measurement.milliseconds * 1000000))

    assertEquals(calculatedNanoseconds, originalNanoseconds, 'Should maintain precision when converting back')
  })

  console.log('\n🏁 All Measurement tests completed!')
}
