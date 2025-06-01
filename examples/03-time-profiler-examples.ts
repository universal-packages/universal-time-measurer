/**
 * TimeProfiler Examples
 *
 * This example demonstrates how to use the TimeProfiler class for advanced performance
 * profiling with checkpoints, memory tracking, and detailed session analysis.
 */
import { TimeProfiler } from '../src'

// Simulate various operations for profiling
async function simulateAsyncWork(name: string, duration: number): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, duration))
  return `${name} completed`
}

function simulateDataProcessing(size: number): Array<{ id: number; value: number; timestamp: Date; processed: boolean }> {
  const data: Array<{ id: number; value: number; timestamp: Date; processed: boolean }> = []
  for (let i = 0; i < size; i++) {
    data.push({
      id: i,
      value: Math.random() * 1000,
      timestamp: new Date(),
      processed: true
    })
  }
  return data
}

function simulateMemoryIntensiveOperation(): string[] {
  // Create a large array to show memory usage
  const result: string[] = []
  for (let i = 0; i < 50000; i++) {
    result.push(`Item ${i}: ${Math.random().toString(36).substring(7)}`)
  }
  return result
}

async function basicProfilerExamples() {
  console.log('=== Basic TimeProfiler Examples ===\n')

  // Example 1: Simple checkpoint profiling
  console.log('1. Basic checkpoint profiling:')
  const profiler = TimeProfiler.start('Simple Operations')

  // First operation
  await simulateAsyncWork('Database Connection', 50)
  profiler.checkpoint('Database Connected')

  // Second operation
  await simulateAsyncWork('User Authentication', 30)
  profiler.checkpoint('User Authenticated')

  // Third operation
  await simulateAsyncWork('Data Retrieval', 75)
  profiler.checkpoint('Data Retrieved')

  // Finish profiling
  const checkpoints = profiler.stop('Operations Complete')

  console.log('   Profiling results:')
  checkpoints.forEach((checkpoint, index) => {
    console.log(`   ${index + 1}. ${checkpoint.name}: ${checkpoint.measurement.toString()} (at ${checkpoint.timestamp.toLocaleTimeString()})`)
  })

  // Example 2: Manual profiler control
  console.log('\n2. Manual profiler control:')
  const manualProfiler = new TimeProfiler({ name: 'Manual Control Session' })

  console.log('   Starting profiler manually...')
  manualProfiler.start()

  await simulateAsyncWork('Setup Phase', 40)
  manualProfiler.checkpoint('Setup Complete')

  await simulateAsyncWork('Processing Phase', 80)
  manualProfiler.checkpoint('Processing Complete')

  console.log(`   Current elapsed time: ${manualProfiler.elapsed?.toString()}`)
  console.log(`   Is running: ${manualProfiler.isRunning}`)
  console.log(`   Last checkpoint: ${manualProfiler.lastCheckpoint?.name}`)

  const finalCheckpoints = manualProfiler.stop('Manual Session Complete')

  console.log('   Final checkpoints:')
  finalCheckpoints.forEach((cp) => {
    console.log(`     ${cp.name}: ${cp.measurement.toString()}`)
  })
}

async function memoryTrackingExamples() {
  console.log('\n=== Memory Tracking Examples ===\n')

  // Example with memory tracking enabled
  console.log('1. Memory tracking during operations:')
  const memoryProfiler = new TimeProfiler({
    name: 'Memory Intensive Operations',
    trackMemory: true
  })

  memoryProfiler.start()

  // Initial checkpoint
  memoryProfiler.checkpoint('Initial State')

  // Create some data
  const smallData = simulateDataProcessing(1000)
  memoryProfiler.checkpoint('Small Data Created')

  // Create more data
  const largeData = simulateDataProcessing(10000)
  memoryProfiler.checkpoint('Large Data Created')

  // Memory intensive operation
  const memoryIntensiveResult = simulateMemoryIntensiveOperation()
  memoryProfiler.checkpoint('Memory Intensive Operation')

  // Process and cleanup
  const processedData = [...smallData, ...largeData].filter((item) => item.value > 500)
  memoryProfiler.checkpoint('Data Filtered')

  const memoryCheckpoints = memoryProfiler.stop('Memory Session Complete')

  console.log('   Memory usage analysis:')
  memoryCheckpoints.forEach((checkpoint, index) => {
    const memoryInfo = checkpoint.memoryUsage ? ` | Memory: ${(checkpoint.memoryUsage / 1024 / 1024).toFixed(2)}MB` : ''
    const deltaInfo = checkpoint.memoryDelta ? ` | Delta: ${(checkpoint.memoryDelta / 1024 / 1024).toFixed(2)}MB` : ''
    console.log(`   ${index + 1}. ${checkpoint.name}: ${checkpoint.measurement.toString()}${memoryInfo}${deltaInfo}`)
  })

  // Clean up references to help with garbage collection
  smallData.length = 0
  largeData.length = 0
  memoryIntensiveResult.length = 0
  processedData.length = 0
}

async function realWorldAPIScenario() {
  console.log('\n=== Real-World API Scenario ===\n')

  console.log('1. Complete API request processing:')

  // Simulate a complete API request flow
  const apiProfiler = TimeProfiler.start('API Request Processing')

  // Request validation
  await simulateAsyncWork('Request Validation', 15)
  apiProfiler.checkpoint('Request Validated')

  // Authentication
  await simulateAsyncWork('User Authentication', 25)
  apiProfiler.checkpoint('User Authenticated')

  // Authorization check
  await simulateAsyncWork('Authorization Check', 10)
  apiProfiler.checkpoint('Authorization Verified')

  // Database queries
  await simulateAsyncWork('Primary Data Query', 45)
  apiProfiler.checkpoint('Primary Data Retrieved')

  await simulateAsyncWork('Related Data Query', 30)
  apiProfiler.checkpoint('Related Data Retrieved')

  // Data processing
  const processedData = simulateDataProcessing(5000)
  apiProfiler.checkpoint('Data Processed')

  // Response formatting
  await simulateAsyncWork('Response Formatting', 20)
  apiProfiler.checkpoint('Response Formatted')

  // Logging and cleanup
  await simulateAsyncWork('Logging and Cleanup', 12)

  const apiCheckpoints = apiProfiler.stop('API Request Complete')

  console.log('   API Processing Timeline:')
  let totalTime = 0
  apiCheckpoints.forEach((checkpoint, index) => {
    const currentTime = checkpoint.measurement.milliseconds
    const stepTime = index > 0 ? currentTime - totalTime : currentTime
    totalTime = currentTime

    console.log(`   ${index + 1}. ${checkpoint.name}:`)
    console.log(`      Cumulative: ${checkpoint.measurement.toString()}`)
    if (index > 0) {
      console.log(`      Step time: ${stepTime.toFixed(3)}ms`)
    }
  })

  // Performance analysis
  console.log('\n   Performance Analysis:')
  const totalRequestTime = apiCheckpoints[apiCheckpoints.length - 1].measurement.milliseconds
  console.log(`   Total request time: ${totalRequestTime.toFixed(3)}ms`)

  // Find bottlenecks (longest individual steps)
  const stepTimes: Array<{ name: string; duration: number }> = []
  for (let i = 1; i < apiCheckpoints.length; i++) {
    const stepTime = apiCheckpoints[i].measurement.milliseconds - apiCheckpoints[i - 1].measurement.milliseconds
    stepTimes.push({
      name: apiCheckpoints[i].name,
      duration: stepTime
    })
  }

  stepTimes.sort((a, b) => b.duration - a.duration)
  console.log('   Top 3 bottlenecks:')
  stepTimes.slice(0, 3).forEach((step, index) => {
    const percentage = ((step.duration / totalRequestTime) * 100).toFixed(1)
    console.log(`   ${index + 1}. ${step.name}: ${step.duration.toFixed(3)}ms (${percentage}%)`)
  })
}

async function databaseOperationProfiling() {
  console.log('\n=== Database Operation Profiling ===\n')

  console.log('1. Complex database operation flow:')

  const dbProfiler = new TimeProfiler({
    name: 'Database Operations',
    trackMemory: true
  })

  dbProfiler.start()

  // Connection setup
  await simulateAsyncWork('Database Connection Pool', 30)
  dbProfiler.checkpoint('Connection Established')

  // Transaction begin
  await simulateAsyncWork('Transaction Begin', 5)
  dbProfiler.checkpoint('Transaction Started')

  // Multiple queries
  const queries = [
    { name: 'User Lookup Query', duration: 25 },
    { name: 'Permissions Query', duration: 15 },
    { name: 'Settings Query', duration: 20 },
    { name: 'Activity Log Query', duration: 35 }
  ]

  for (const query of queries) {
    await simulateAsyncWork(query.name, query.duration)
    dbProfiler.checkpoint(`${query.name} Complete`)
  }

  // Data aggregation
  const aggregatedData = simulateDataProcessing(8000)
  dbProfiler.checkpoint('Data Aggregated')

  // Transaction commit
  await simulateAsyncWork('Transaction Commit', 8)
  dbProfiler.checkpoint('Transaction Committed')

  // Connection cleanup
  await simulateAsyncWork('Connection Cleanup', 5)

  const dbCheckpoints = dbProfiler.stop('Database Session Complete')

  console.log('   Database operation timeline:')
  dbCheckpoints.forEach((checkpoint, index) => {
    let output = `   ${index + 1}. ${checkpoint.name}: ${checkpoint.measurement.toString()}`

    if (checkpoint.memoryUsage) {
      output += ` | Memory: ${(checkpoint.memoryUsage / 1024 / 1024).toFixed(2)}MB`
    }

    console.log(output)
  })

  // Query performance analysis
  console.log('\n   Query Performance Analysis:')
  const queryCheckpoints = dbCheckpoints.filter((cp) => cp.name.includes('Query'))
  if (queryCheckpoints.length > 0) {
    let previousTime = dbCheckpoints.find((cp) => cp.name === 'Transaction Started')?.measurement.milliseconds || 0

    queryCheckpoints.forEach((checkpoint) => {
      const queryTime = checkpoint.measurement.milliseconds - previousTime
      console.log(`   ${checkpoint.name}: ${queryTime.toFixed(3)}ms`)

      // Find the next checkpoint after this query
      const currentIndex = dbCheckpoints.findIndex((cp) => cp.name === checkpoint.name)
      if (currentIndex >= 0 && currentIndex < dbCheckpoints.length - 1) {
        previousTime = checkpoint.measurement.milliseconds
      }
    })
  }
}

async function profilerUtilityMethods() {
  console.log('\n=== Profiler Utility Methods ===\n')

  console.log('1. Checkpoint retrieval and session management:')

  const utilityProfiler = TimeProfiler.start('Utility Demonstration')

  // Add several checkpoints
  await simulateAsyncWork('Operation A', 30)
  utilityProfiler.checkpoint('A Complete')

  await simulateAsyncWork('Operation B', 45)
  utilityProfiler.checkpoint('B Complete')

  await simulateAsyncWork('Operation C', 25)
  utilityProfiler.checkpoint('C Complete')

  // Demonstrate utility methods
  console.log('   Checkpoint access:')
  console.log(`   Total checkpoints so far: ${utilityProfiler.checkpoints.length}`)
  console.log(`   Last checkpoint: ${utilityProfiler.lastCheckpoint?.name}`)
  console.log(`   Current elapsed time: ${utilityProfiler.elapsed?.toString()}`)

  // Retrieve specific checkpoint
  const checkpointB = utilityProfiler.getCheckpoint('B Complete')
  if (checkpointB) {
    console.log(`   Operation B took: ${checkpointB.measurement.toString()}`)
  }

  // Check profiler state
  console.log(`   Profiler is running: ${utilityProfiler.isRunning}`)

  // Complete the session
  const finalCheckpoints = utilityProfiler.stop('All Operations Complete')
  console.log(`   Final checkpoint count: ${finalCheckpoints.length}`)
  console.log(`   Profiler is running after stop: ${utilityProfiler.isRunning}`)

  // Demonstrate reset functionality
  console.log('\n2. Profiler reset and reuse:')

  utilityProfiler.reset()
  console.log(`   After reset - checkpoints: ${utilityProfiler.checkpoints.length}`)
  console.log(`   After reset - is running: ${utilityProfiler.isRunning}`)

  // Start a new session
  utilityProfiler.start()
  await simulateAsyncWork('New Session Operation', 20)
  utilityProfiler.checkpoint('New Session Checkpoint')

  const newSessionCheckpoints = utilityProfiler.stop('New Session Complete')
  console.log(`   New session checkpoints: ${newSessionCheckpoints.length}`)
  newSessionCheckpoints.forEach((cp) => {
    console.log(`     ${cp.name}: ${cp.measurement.toString()}`)
  })
}

async function errorHandlingAndBestPractices() {
  console.log('\n=== Error Handling and Best Practices ===\n')

  console.log('1. Error handling scenarios:')

  // Test starting an already started profiler
  const errorProfiler = new TimeProfiler({ name: 'Error Testing' })
  errorProfiler.start()

  try {
    errorProfiler.start() // This should throw an error
  } catch (error) {
    console.log(`   Expected error (double start): ${(error as Error).message}`)
  }

  // Test checkpoint on non-started profiler
  const unstartedProfiler = new TimeProfiler({ name: 'Not Started' })
  try {
    unstartedProfiler.checkpoint('Should Fail') // This should throw an error
  } catch (error) {
    console.log(`   Expected error (checkpoint before start): ${(error as Error).message}`)
  }

  // Clean up the started profiler
  errorProfiler.stop('Error Test Complete')

  console.log('\n2. Best practices demonstration:')

  // Best practice: Use try/finally for cleanup
  const safeProfiler = TimeProfiler.start('Safe Profiling')

  try {
    await simulateAsyncWork('Risky Operation', 30)
    safeProfiler.checkpoint('Risky Operation Complete')

    // Simulate a potential error scenario
    const shouldFail = Math.random() > 0.5
    if (shouldFail) {
      throw new Error('Simulated operation failure')
    }

    await simulateAsyncWork('Final Operation', 20)
    safeProfiler.checkpoint('All Operations Complete')
  } catch (error) {
    console.log(`   Handled error: ${(error as Error).message}`)
    safeProfiler.checkpoint('Error Handled')
  } finally {
    // Always ensure profiler is stopped
    if (safeProfiler.isRunning) {
      const checkpoints = safeProfiler.stop('Session Ended (Finally Block)')
      console.log(`   Session completed with ${checkpoints.length} checkpoints`)
      console.log(`   Total session time: ${checkpoints[checkpoints.length - 1].measurement.toString()}`)
    }
  }

  console.log('\n3. Performance optimization tips:')
  console.log('   - Use descriptive checkpoint names for better analysis')
  console.log('   - Enable memory tracking only when needed (has overhead)')
  console.log('   - Consider checkpoint frequency vs. precision trade-offs')
  console.log('   - Always clean up profiler sessions in production code')
  console.log('   - Use profiler data to identify bottlenecks, not for user-facing metrics')
}

// Run all TimeProfiler examples
async function runAllProfilerExamples() {
  try {
    await basicProfilerExamples()
    await memoryTrackingExamples()
    await realWorldAPIScenario()
    await databaseOperationProfiling()
    await profilerUtilityMethods()
    await errorHandlingAndBestPractices()

    console.log('\n✅ All TimeProfiler examples completed successfully!')
  } catch (error) {
    console.error('❌ Error running profiler examples:', error)
  }
}

export { runAllProfilerExamples }
