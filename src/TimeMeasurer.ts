import { Measurement } from './Measurement'

export class TimeMeasurer {
  private hrStart: bigint = 0n
  private startTime: number = 0

  /**
   * Start a new measurer
   * @returns Measurer instance
   */
  public static start(): TimeMeasurer {
    const measurer = new TimeMeasurer()
    measurer.start()
    return measurer
  }

  /**
   * Start the measurer
   */
  public start(): void {
    if (this.hrStart || this.startTime) {
      throw new Error('Measurer already started')
    }

    if (typeof process !== 'undefined' && process.hrtime) {
      this.hrStart = process.hrtime.bigint()
    } else {
      this.startTime = performance.now()
    }
  }

  /**
   * Finish the measurer
   * @returns Measurement instance
   */
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
