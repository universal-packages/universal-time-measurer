import { Measurement } from './Measurement'

export interface BenchmarkOptions {
  /** Number of iterations to run the benchmark */
  iterations?: number
  /** Number of warmup iterations before actual measurement */
  warmupIterations?: number
  /** Name/description of the benchmark */
  name?: string
}

export interface BenchmarkResult {
  /** Name of the benchmark */
  name: string
  /** Total number of iterations performed */
  iterations: number
  /** Number of warmup iterations performed */
  warmupIterations: number
  /** All individual measurements */
  measurements: Measurement[]
  /** Minimum measurement */
  min: Measurement
  /** Maximum measurement */
  max: Measurement
  /** Average measurement */
  average: Measurement
  /** Total time for all iterations */
  total: Measurement
}
