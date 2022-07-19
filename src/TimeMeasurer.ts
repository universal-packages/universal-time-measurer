import Measurement from './Measurement'

/**
 *
 * It meassures the time a process takes from the time start is called
 * to when the finish method is called
 *
 */
export default class TimeMeasurer {
  private hrstart: bigint

  public constructor() {
    this.hrstart = process.hrtime.bigint()
  }

  /** Returns a measurement representing the time passed from when start wass colled */
  public finish(): Measurement {
    const nanoseconds = process.hrtime.bigint() - this.hrstart

    return new Measurement(nanoseconds)
  }
}
