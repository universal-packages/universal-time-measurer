import Measurement from './Measurement'

/**
 *
 * It measures the time a process takes from the time start is called
 * to when the finish method is called
 *
 */
export default class TimeMeasurer {
  private hrStart: bigint = 0n
  private startTime: number = 0

  /** Resets the initial time */
  public start(): void {
    if (typeof process !== 'undefined' && process.hrtime) {
      this.hrStart = process.hrtime.bigint()
    } else {
      this.startTime = performance.now()
    }
  }

  /** Returns a measurement representing the time passed from when start was called */
  public finish(): Measurement {
    let nanoseconds: bigint
    if (typeof process !== 'undefined' && process.hrtime) {
      nanoseconds = process.hrtime.bigint() - this.hrStart
    } else {
      const milliseconds = performance.now() - this.startTime
      nanoseconds = BigInt(Math.round(milliseconds * 1e6))
    }

    return new Measurement(nanoseconds)
  }
}
