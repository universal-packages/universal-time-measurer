import { benchmarkTest } from './Benchmark.test'
import { measurementTest } from './Measurement.test'
import { sleepTest } from './Sleep.test'
import { timeMeasurerTest } from './TimeMeasurer.test'
import { timeProfilerTest } from './TimeProfiler.test'

async function runTests(): Promise<void> {
  await measurementTest()
  console.log('\n' + '='.repeat(50) + '\n')
  await benchmarkTest()
  console.log('\n' + '='.repeat(50) + '\n')
  await timeProfilerTest()
  console.log('\n' + '='.repeat(50) + '\n')
  await sleepTest()
  console.log('\n' + '='.repeat(50) + '\n')
  await timeMeasurerTest()
}

runTests()
