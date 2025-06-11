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

  // Test 11: Arithmetic operations - add method
  await runTest('Arithmetic operations - add method', () => {
    const measurement1 = new Measurement(1000000000n) // 1 second
    const measurement2 = new Measurement(2000000000n) // 2 seconds
    const measurement3 = new Measurement(500000000n) // 0.5 seconds

    const sum1 = measurement1.add(measurement2)
    assertEquals(sum1.nanoseconds, 3000000000n, 'Should add two measurements correctly')
    assertEquals(sum1.seconds, 3, 'Sum should have correct seconds')

    const sum2 = measurement1.add(measurement3)
    assertEquals(sum2.nanoseconds, 1500000000n, 'Should add fractional measurements')
    assertEquals(sum2.seconds, 1, 'Should have 1 second')
    assertEquals(sum2.milliseconds, 500, 'Should have 500 milliseconds')

    // Test adding zero
    const sum3 = measurement1.add(new Measurement(0n))
    assertEquals(sum3.nanoseconds, measurement1.nanoseconds, 'Adding zero should return same measurement')

    // Test chaining
    const sum4 = measurement1.add(measurement2).add(measurement3)
    assertEquals(sum4.nanoseconds, 3500000000n, 'Should support chaining add operations')
  })

  // Test 12: Arithmetic operations - subtract method
  await runTest('Arithmetic operations - subtract method', () => {
    const measurement1 = new Measurement(2000000000n) // 2 seconds
    const measurement2 = new Measurement(1000000000n) // 1 second
    const measurement3 = new Measurement(500000000n) // 0.5 seconds

    const diff1 = measurement1.subtract(measurement2)
    assertEquals(diff1.nanoseconds, 1000000000n, 'Should subtract measurements correctly')
    assertEquals(diff1.seconds, 1, 'Difference should have correct seconds')

    const diff2 = measurement2.subtract(measurement3)
    assertEquals(diff2.nanoseconds, 500000000n, 'Should subtract fractional measurements')
    assertEquals(diff2.milliseconds, 500, 'Should have 500 milliseconds')

    // Test subtracting zero
    const diff3 = measurement1.subtract(new Measurement(0n))
    assertEquals(diff3.nanoseconds, measurement1.nanoseconds, 'Subtracting zero should return same measurement')

    // Test negative result (should return 0)
    const diff4 = measurement3.subtract(measurement1)
    assertEquals(diff4.nanoseconds, 0n, 'Negative result should return zero measurement')

    // Test equal measurements
    const diff5 = measurement1.subtract(measurement1)
    assertEquals(diff5.nanoseconds, 0n, 'Subtracting equal measurements should return zero')
  })

  // Test 13: Comparison methods - equals
  await runTest('Comparison methods - equals', () => {
    const measurement1 = new Measurement(1000000000n) // 1 second
    const measurement2 = new Measurement(1000000000n) // 1 second (same)
    const measurement3 = new Measurement(2000000000n) // 2 seconds (different)

    assertEquals(measurement1.equals(measurement2), true, 'Equal measurements should return true')
    assertEquals(measurement1.equals(measurement3), false, 'Different measurements should return false')
    assertEquals(measurement1.equals(measurement1), true, 'Same instance should equal itself')

    // Test with zero
    const zero1 = new Measurement(0n)
    const zero2 = new Measurement(0n)
    assertEquals(zero1.equals(zero2), true, 'Zero measurements should be equal')
  })

  // Test 14: Comparison methods - lessThan and greaterThan
  await runTest('Comparison methods - lessThan and greaterThan', () => {
    const small = new Measurement(500000000n) // 0.5 seconds
    const medium = new Measurement(1000000000n) // 1 second
    const large = new Measurement(2000000000n) // 2 seconds

    // lessThan tests
    assertEquals(small.lessThan(medium), true, 'Small should be less than medium')
    assertEquals(medium.lessThan(large), true, 'Medium should be less than large')
    assertEquals(large.lessThan(small), false, 'Large should not be less than small')
    assertEquals(medium.lessThan(medium), false, 'Equal measurements should not be less than each other')

    // greaterThan tests
    assertEquals(large.greaterThan(medium), true, 'Large should be greater than medium')
    assertEquals(medium.greaterThan(small), true, 'Medium should be greater than small')
    assertEquals(small.greaterThan(large), false, 'Small should not be greater than large')
    assertEquals(medium.greaterThan(medium), false, 'Equal measurements should not be greater than each other')
  })

  // Test 15: Comparison methods - lessThanOrEqual and greaterThanOrEqual
  await runTest('Comparison methods - lessThanOrEqual and greaterThanOrEqual', () => {
    const small = new Measurement(500000000n) // 0.5 seconds
    const medium = new Measurement(1000000000n) // 1 second
    const large = new Measurement(2000000000n) // 2 seconds
    const mediumCopy = new Measurement(1000000000n) // 1 second (same as medium)

    // lessThanOrEqual tests
    assertEquals(small.lessThanOrEqual(medium), true, 'Small should be less than or equal to medium')
    assertEquals(medium.lessThanOrEqual(mediumCopy), true, 'Equal measurements should be less than or equal')
    assertEquals(large.lessThanOrEqual(small), false, 'Large should not be less than or equal to small')

    // greaterThanOrEqual tests
    assertEquals(large.greaterThanOrEqual(medium), true, 'Large should be greater than or equal to medium')
    assertEquals(medium.greaterThanOrEqual(mediumCopy), true, 'Equal measurements should be greater than or equal')
    assertEquals(small.greaterThanOrEqual(large), false, 'Small should not be greater than or equal to large')
  })

  // Test 16: Operator overloading - Symbol.toPrimitive
  await runTest('Operator overloading - Symbol.toPrimitive', () => {
    const measurement1 = new Measurement(1000000000n) // 1 second
    const measurement2 = new Measurement(2000000000n) // 2 seconds

    // Test bigint conversion
    const bigintValue = measurement1.nanoseconds
    assertEquals(bigintValue, 1000000000n, 'Should convert to bigint correctly')

    // Test number conversion
    const numberValue = Number(measurement1)
    assertEquals(numberValue, 1000000000, 'Should convert to number correctly')

    // Test string conversion
    const stringValue = String(measurement1)
    assertEquals(stringValue, '1.000sec', 'Should convert to string correctly')

    // Test comparison operators (these use number conversion)
    assertEquals(measurement1 < measurement2, true, 'Should support < operator')
    assertEquals(measurement1 > measurement2, false, 'Should support > operator')
    assertEquals(measurement1 <= measurement2, true, 'Should support <= operator')
    assertEquals(measurement1 >= measurement2, false, 'Should support >= operator')
    assertEquals(measurement1 == measurement2, false, 'Should support == operator')
    assertEquals(measurement1 != measurement2, true, 'Should support != operator')

    // Test arithmetic operators (return numbers, not Measurement objects)
    const sum = Number(measurement1) + Number(measurement2)
    assertEquals(sum, 3000000000, 'Should support + operator (returns number)')
    const diff = Number(measurement2) - Number(measurement1)
    assertEquals(diff, 1000000000, 'Should support - operator (returns number)')
  })

  // Test 17: Complex operations and chaining
  await runTest('Complex operations and chaining', () => {
    const base = new Measurement(1000000000n) // 1 second
    const half = new Measurement(500000000n) // 0.5 seconds
    const quarter = new Measurement(250000000n) // 0.25 seconds

    // Test complex chaining
    const result1 = base.add(half).subtract(quarter)
    assertEquals(result1.nanoseconds, 1250000000n, 'Should support add then subtract chaining')
    assertEquals(result1.seconds, 1, 'Should have 1 second')
    assertEquals(result1.milliseconds, 250, 'Should have 250 milliseconds')

    // Test longer chains
    const result2 = base.add(half).add(quarter).subtract(base)
    assertEquals(result2.nanoseconds, 750000000n, 'Should support longer operation chains')
    assertEquals(result2.milliseconds, 750, 'Should have 750 milliseconds')

    // Test with zero operations
    const result3 = base.add(new Measurement(0n)).subtract(new Measurement(0n))
    assertEquals(result3.nanoseconds, base.nanoseconds, 'Should handle zero operations in chains')
  })

  // Test 18: Edge cases for arithmetic operations
  await runTest('Edge cases - Arithmetic operations', () => {
    const large = new Measurement(BigInt(Number.MAX_SAFE_INTEGER))
    const small = new Measurement(1n)

    // Test very large numbers
    const sum = large.add(small)
    assertEquals(sum.nanoseconds > large.nanoseconds, true, 'Should handle large number addition')

    // Test subtraction resulting in zero
    const zero = small.subtract(small)
    assertEquals(zero.nanoseconds, 0n, 'Subtracting equal values should result in zero')

    // Test subtraction with negative result (should clamp to zero)
    const negativeResult = small.subtract(large)
    assertEquals(negativeResult.nanoseconds, 0n, 'Negative subtraction should clamp to zero')
  })

  console.log('\n🏁 All Measurement tests completed!')
}
