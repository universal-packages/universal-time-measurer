/**
 * Basic Time Measurement Example
 *
 * This example demonstrates how to use TimeMeasurer for basic time measurements
 * including different instantiation patterns and measurement formatting.
 */
import { Measurement, TimeMeasurer } from '../src'

async function basicTimeMeasurement() {
  console.log('=== Basic Time Measurement Example ===\n')

  // Method 1: Static start() - Most convenient for quick measurements
  console.log('1. Using static start() method:')
  const quickMeasurer = TimeMeasurer.start()

  // Simulate some work
  await new Promise((resolve) => setTimeout(resolve, 150))

  const quickMeasurement = quickMeasurer.finish()
  console.log(`   Quick operation took: ${quickMeasurement.toString()}`)
  console.log(`   In milliseconds: ${quickMeasurement.milliseconds}ms`)
  console.log(`   In seconds: ${quickMeasurement.seconds}s\n`)

  // Method 2: Manual instantiation and control
  console.log('2. Using manual instantiation:')
  const measurer = new TimeMeasurer()

  console.log('   Starting measurement...')
  measurer.start()

  // Simulate a longer operation
  await new Promise((resolve) => setTimeout(resolve, 250))

  const measurement = measurer.finish()
  console.log(`   Longer operation took: ${measurement.toString()}`)

  // Method 3: Measuring multiple operations with the same measurer
  console.log('\n3. Measuring sequential operations:')
  const operations = ['Database query', 'Data processing', 'Response formatting']

  for (const operation of operations) {
    const opMeasurer = TimeMeasurer.start()

    // Simulate different operation times
    const delay = Math.random() * 100 + 50 // 50-150ms
    await new Promise((resolve) => setTimeout(resolve, delay))

    const opMeasurement = opMeasurer.finish()
    console.log(`   ${operation}: ${opMeasurement.toString()}`)
  }
}

async function measurementFormatting() {
  console.log('\n=== Measurement Formatting Examples ===\n')

  // Create different duration measurements for formatting examples
  const shortMeasurer = TimeMeasurer.start()
  await new Promise((resolve) => setTimeout(resolve, 123))
  const shortMeasurement = shortMeasurer.finish()

  console.log('Short operation (123ms):')
  console.log(`   Human format (default): ${shortMeasurement.toString('Human')}`)
  console.log(`   Condensed format: ${shortMeasurement.toString('Condensed')}`)
  console.log(`   Expressive format: ${shortMeasurement.toString('Expressive')}`)

  // Simulate a longer measurement for better formatting demonstration
  const longMeasurement = new Measurement(BigInt(65123456789)) // ~65 seconds

  console.log('\nLong operation (65+ seconds):')
  console.log(`   Human format: ${longMeasurement.toString('Human')}`)
  console.log(`   Condensed format: ${longMeasurement.toString('Condensed')}`)
  console.log(`   Expressive format: ${longMeasurement.toString('Expressive')}`)

  // Access individual time components
  console.log('\nTime component access:')
  console.log(`   Hours: ${longMeasurement.hours}`)
  console.log(`   Minutes: ${longMeasurement.minutes}`)
  console.log(`   Seconds: ${longMeasurement.seconds}`)
  console.log(`   Total milliseconds: ${longMeasurement.milliseconds}`)

  // Convert to Date object
  const date = longMeasurement.toDate()
  console.log(`   As Date: ${date.toTimeString()}`)
}

async function realWorldScenarios() {
  console.log('\n=== Real-World Scenarios ===\n')

  // Scenario 1: API Request timing
  console.log('1. API Request Simulation:')
  async function simulateApiRequest(endpoint: string) {
    const measurer = TimeMeasurer.start()

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 100))

    const measurement = measurer.finish()
    console.log(`   ${endpoint} responded in ${measurement.toString()}`)
    return { endpoint, duration: measurement }
  }

  await simulateApiRequest('GET /api/users')
  await simulateApiRequest('POST /api/auth/login')
  await simulateApiRequest('GET /api/dashboard/stats')

  // Scenario 2: File processing timing
  console.log('\n2. File Processing Simulation:')
  async function processFile(filename: string, size: number) {
    const measurer = TimeMeasurer.start()

    // Simulate processing time based on file size
    const processingTime = Math.max(50, size / 1000) // Larger files take longer
    await new Promise((resolve) => setTimeout(resolve, processingTime))

    const measurement = measurer.finish()
    console.log(`   Processed ${filename} (${size}KB) in ${measurement.toString()}`)

    return measurement
  }

  const files = [
    { name: 'small.txt', size: 10 },
    { name: 'medium.json', size: 500 },
    { name: 'large.csv', size: 2000 }
  ]

  const processingTimes: Measurement[] = []
  for (const file of files) {
    const measurement = await processFile(file.name, file.size)
    processingTimes.push(measurement)
  }

  // Calculate total processing time
  const totalNanoseconds = processingTimes.reduce((total, measurement) => total + BigInt(measurement.milliseconds * 1000000), BigInt(0))
  const totalMeasurement = new Measurement(totalNanoseconds)
  console.log(`   Total processing time: ${totalMeasurement.toString()}`)
}

// Error handling examples
async function errorHandlingExamples() {
  console.log('\n=== Error Handling Examples ===\n')

  // Example 1: Double start protection
  console.log('1. Double start protection:')
  const measurer = new TimeMeasurer()
  measurer.start()

  try {
    measurer.start() // This will throw an error
  } catch (error) {
    console.log(`   Expected error: ${(error as Error).message}`)
  }

  measurer.finish() // Clean up

  // Example 2: Finish without start protection
  console.log('\n2. Finish without start protection:')
  const unmeasurer = new TimeMeasurer()

  try {
    unmeasurer.finish() // This will throw an error
  } catch (error) {
    console.log(`   Expected error: ${(error as Error).message}`)
  }
}

// Run all examples
async function runAllExamples() {
  try {
    await basicTimeMeasurement()
    await measurementFormatting()
    await realWorldScenarios()
    await errorHandlingExamples()

    console.log('\n✅ All basic time measurement examples completed successfully!')
  } catch (error) {
    console.error('❌ Error running examples:', error)
  }
}

export { runAllExamples }
