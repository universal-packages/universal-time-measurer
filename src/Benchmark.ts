import { BenchmarkOptions, BenchmarkResult } from './Benchmark.types'
import { Measurement } from './Measurement'
import { TimeMeasurer } from './TimeMeasurer'

export class Benchmark {
  private options: Required<BenchmarkOptions>

  constructor(options?: BenchmarkOptions) {
    this.options = {
      iterations: 1,
      warmupIterations: 0,
      name: 'Unnamed Benchmark',
      ...options
    }
  }

  /**
   * Run the benchmark with the provided function
   * @param fn - The function to benchmark
   * @returns BenchmarkResult containing all measurements and statistics
   */
  public run(fn: () => void): BenchmarkResult {
    const measurements: Measurement[] = []

    // Perform warmup iterations
    for (let i = 0; i < this.options.warmupIterations; i++) {
      fn()
    }

    // Perform actual benchmark iterations
    for (let i = 0; i < this.options.iterations; i++) {
      const measurer = TimeMeasurer.start()
      fn()
      const measurement = measurer.finish()
      measurements.push(measurement)
    }

    const result = this.calculateStatistics(measurements)

    return result
  }

  /**
   * Run an async function benchmark
   * @param fn - The async function to benchmark
   * @returns Promise<BenchmarkResult> containing all measurements and statistics
   */
  public async runAsync(fn: () => Promise<void>): Promise<BenchmarkResult> {
    const measurements: Measurement[] = []

    // Perform warmup iterations
    for (let i = 0; i < this.options.warmupIterations; i++) {
      await fn()
    }

    // Perform actual benchmark iterations
    for (let i = 0; i < this.options.iterations; i++) {
      const measurer = TimeMeasurer.start()
      await fn()
      const measurement = measurer.finish()
      measurements.push(measurement)
    }

    const result = this.calculateStatistics(measurements)

    return result
  }

  /**
   * Calculate statistics from measurements
   * @param measurements - Array of measurements
   * @returns BenchmarkResult with calculated statistics
   */
  private calculateStatistics(measurements: Measurement[]): BenchmarkResult {
    if (measurements.length === 0) {
      throw new Error('No measurements to calculate statistics from')
    }

    // Convert measurements to nanoseconds for calculations
    const nanoseconds = measurements.map(
      (m) => BigInt(m.hours) * 3600000000000n + BigInt(m.minutes) * 60000000000n + BigInt(m.seconds) * 1000000000n + BigInt(Math.round(m.milliseconds * 1000000))
    )

    const minNs = nanoseconds.reduce((min, current) => (current < min ? current : min))
    const maxNs = nanoseconds.reduce((max, current) => (current > max ? current : max))
    const totalNs = nanoseconds.reduce((sum, current) => sum + current, 0n)
    const averageNs = totalNs / BigInt(nanoseconds.length)

    return {
      name: this.options.name,
      iterations: this.options.iterations,
      warmupIterations: this.options.warmupIterations,
      measurements,
      min: new Measurement(minNs),
      max: new Measurement(maxNs),
      average: new Measurement(averageNs),
      total: new Measurement(totalNs)
    }
  }
}
