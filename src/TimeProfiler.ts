import { Measurement } from './Measurement'
import { ProfilerCheckpoint, ProfilerOptions } from './TimeProfiler.types'

export class TimeProfiler {
  public readonly options: ProfilerOptions

  private startTime: bigint | number = 0
  private isStarted: boolean = false
  private _checkpoints: ProfilerCheckpoint[] = []
  private lastMemoryUsage: number = 0

  /**
   * Get all checkpoints recorded so far
   * @returns Array of all checkpoints
   */
  public get checkpoints(): ProfilerCheckpoint[] {
    return [...this._checkpoints]
  }

  /**
   * Get the last checkpoint recorded
   * @returns The most recent checkpoint, or undefined if none
   */
  public get lastCheckpoint(): ProfilerCheckpoint | undefined {
    return this._checkpoints[this._checkpoints.length - 1]
  }

  /**
   * Check if the profiler is currently running
   * @returns True if started, false otherwise
   */
  public get isRunning(): boolean {
    return this.isStarted
  }

  /**
   * Get the total elapsed time since start
   * @returns Current measurement from start, or undefined if not started
   */
  public get elapsed(): Measurement | undefined {
    if (!this.isStarted) {
      return undefined
    }

    let nanoseconds: bigint
    if (typeof process !== 'undefined' && process.hrtime && typeof this.startTime === 'bigint') {
      nanoseconds = process.hrtime.bigint() - this.startTime
    } else {
      const milliseconds = performance.now() - (this.startTime as number)
      nanoseconds = BigInt(Math.round(milliseconds * 1e6))
    }

    return new Measurement(nanoseconds)
  }

  constructor(options?: ProfilerOptions) {
    this.options = {
      name: 'Profiler Session',
      trackMemory: false,
      ...options
    }
  }

  /**
   * Get a specific checkpoint by name
   * @param name - Name of the checkpoint to find
   * @returns The checkpoint, or undefined if not found
   */
  public getCheckpoint(name: string): ProfilerCheckpoint | undefined {
    return this._checkpoints.find((cp) => cp.name === name)
  }

  /**
   * Start the profiler session
   * @throws Error if already started
   */
  public start(): void {
    if (this.isStarted) {
      throw new Error('Profiler already started. Call reset() to start a new session.')
    }

    if (typeof process !== 'undefined' && process.hrtime) {
      this.startTime = process.hrtime.bigint()
    } else {
      this.startTime = performance.now()
    }

    this.isStarted = true
    this._checkpoints = []

    // Initialize memory tracking if enabled
    if (this.options.trackMemory) {
      this.lastMemoryUsage = this.getCurrentMemoryUsage()
    }
  }

  /**
   * Create a checkpoint measurement from the start time
   * @param name - Name/label for this checkpoint
   * @returns The measurement from start to this checkpoint
   * @throws Error if not started
   */
  public checkpoint(name: string): Measurement {
    if (!this.isStarted) {
      throw new Error('Profiler not started. Call start() first.')
    }

    let nanoseconds: bigint
    if (typeof process !== 'undefined' && process.hrtime && typeof this.startTime === 'bigint') {
      nanoseconds = process.hrtime.bigint() - this.startTime
    } else {
      const milliseconds = performance.now() - (this.startTime as number)
      nanoseconds = BigInt(Math.round(milliseconds * 1e6))
    }

    const measurement = new Measurement(nanoseconds)
    const checkpoint: ProfilerCheckpoint = {
      name,
      measurement,
      timestamp: new Date()
    }

    // Add memory tracking if enabled
    if (this.options.trackMemory) {
      const currentMemory = this.getCurrentMemoryUsage()
      checkpoint.memoryUsage = currentMemory

      // First checkpoint has delta 0, subsequent ones have delta from previous
      if (this._checkpoints.length === 0) {
        checkpoint.memoryDelta = 0
      } else {
        checkpoint.memoryDelta = currentMemory - this.lastMemoryUsage
      }

      this.lastMemoryUsage = currentMemory
    }

    this._checkpoints.push(checkpoint)

    return measurement
  }

  /**
   * Stop the profiler and get final summary
   * @param finalCheckpointName - Optional name for the final checkpoint
   * @returns Array of all checkpoints including the final one
   */
  public stop(finalCheckpointName: string = 'Final'): ProfilerCheckpoint[] {
    if (!this.isStarted) {
      throw new Error('Profiler not started.')
    }

    // Add final checkpoint
    this.checkpoint(finalCheckpointName)

    this.isStarted = false

    return this.checkpoints
  }

  /**
   * Reset the profiler to start a new session
   */
  public reset(): void {
    this.isStarted = false
    this.startTime = 0
    this._checkpoints = []
    this.lastMemoryUsage = 0
  }

  /**
   * Get current memory usage in bytes
   * @returns Memory usage in bytes, or 0 if unavailable
   */
  private getCurrentMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed
    } else if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize || 0
    }
    return 0
  }

  /**
   * Create a quick profiler that auto-starts
   * @param name - Name for the profiler session
   * @param autoLog - Whether to auto-log checkpoints
   * @returns Started TimeProfiler instance
   */
  public static start(name?: string): TimeProfiler {
    const profiler = new TimeProfiler({ name })
    profiler.start()
    return profiler
  }
}
