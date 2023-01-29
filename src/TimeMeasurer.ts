import Measurement from './Measurement'

/**
 *
 * It measures the time a process takes from the time start is called
 * to when the finish method is called
 *
 */
export default class TimeMeasurer {
  private hrStart: bigint = 0n

  /** Resets the initial time */
  public start(): void {
    this.hrStart = process.hrtime.bigint()
  }

  /** Returns a measurement representing the time passed from when start was called */
  public finish(): Measurement {
    const nanoseconds = process.hrtime.bigint() - this.hrStart

    return new Measurement(nanoseconds)
  }
}
