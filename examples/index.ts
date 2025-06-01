import { runAllExamples as runBasicTimeMeasurement } from './01-basic-time-measurement'
import { runAllBenchmarkExamples } from './02-benchmark-examples'
import { runAllProfilerExamples } from './03-time-profiler-examples'
import { runAllSleepExamples } from './04-sleep-examples'

/**
 * Run all examples in sequence with timing and organization
 */
async function runAllExamples(): Promise<void> {
  console.log('🚀 Universal Time Measurer - Complete Examples Suite')
  console.log('='.repeat(60))
  console.log('')

  const examples = [
    {
      name: 'Basic Time Measurement',
      description: 'TimeMeasurer class and Measurement formatting',
      runner: runBasicTimeMeasurement
    },
    {
      name: 'Benchmark Examples',
      description: 'Performance benchmarking and statistical analysis',
      runner: runAllBenchmarkExamples
    },
    {
      name: 'TimeProfiler Examples',
      description: 'Advanced profiling with checkpoints and memory tracking',
      runner: runAllProfilerExamples
    },
    {
      name: 'Sleep Utility Examples',
      description: 'Async delays and rate limiting patterns',
      runner: runAllSleepExamples
    }
  ]

  let completedExamples = 0
  const totalExamples = examples.length

  for (const example of examples) {
    try {
      console.log(`\n🔧 Running: ${example.name}`)
      console.log(`📋 Description: ${example.description}`)
      console.log(`⏱️  Starting at: ${new Date().toLocaleTimeString()}`)
      console.log('')

      const startTime = Date.now()
      await example.runner()
      const endTime = Date.now()
      const duration = endTime - startTime

      completedExamples++
      console.log('')
      console.log(`✅ Completed: ${example.name} in ${duration}ms`)
      console.log(`📊 Progress: ${completedExamples}/${totalExamples} examples completed`)

      if (completedExamples < totalExamples) {
        console.log('')
        console.log('─'.repeat(60))
      }
    } catch (error) {
      console.error(`❌ Error in ${example.name}:`, error)
      console.log(`📊 Progress: ${completedExamples}/${totalExamples} examples completed (1 failed)`)
      throw error // Re-throw to stop execution on error
    }
  }

  console.log('')
  console.log('🎉 All Examples Complete!')
  console.log('='.repeat(60))
  console.log('')
  console.log('📚 What you learned:')
  console.log('• TimeMeasurer: Simple, precise time measurements')
  console.log('• Measurement: Flexible time formatting and analysis')
  console.log('• Benchmark: Performance testing with statistical analysis')
  console.log('• TimeProfiler: Checkpoint-based profiling with memory tracking')
  console.log('• Sleep: Human-readable async delays and rate limiting')
  console.log('')
  console.log('🔗 For more information:')
  console.log('• Documentation: Check the README.md file')
  console.log('• Source code: Browse the src/ directory')
  console.log('• Package: https://www.npmjs.com/package/@universal-packages/time-measurer')
  console.log('')
}

runAllExamples()
