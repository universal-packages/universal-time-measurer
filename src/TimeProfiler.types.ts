import { Measurement } from './Measurement'

export interface ProfilerCheckpoint {
  /** Name/label for this checkpoint */
  name: string
  /** Measurement from start to this checkpoint */
  measurement: Measurement
  /** Timestamp when this checkpoint was created */
  timestamp: Date
  /** Memory usage at this checkpoint in bytes (if tracking enabled) */
  memoryUsage?: number
  /** Memory delta from previous checkpoint in bytes (if tracking enabled) */
  memoryDelta?: number
}

export interface ProfilerOptions {
  /** Name for this profiler session */
  name?: string
  /** Whether to track memory usage deltas between checkpoints */
  trackMemory?: boolean
}
