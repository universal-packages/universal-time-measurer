import Measurement from './Measurement'
import sleep from './sleep'

/**
 *
 * It meassures the time a process takes from the instantiation time
 * to when the finish method is called
 *
 */
export default class ProcessMeasurer {
  private hrstart: bigint

  /** Starts a measurement*/
  public start(): void {
    this.hrstart = process.hrtime.bigint()
  }

  /** Returns a measurement representing the time passed from when start wass colled */
  public finish(): Measurement {
    if (this.hrstart === undefined) throw new Error('Process measurer finished without previously started')

    const nanoseconds = process.hrtime.bigint() - this.hrstart

    return new Measurement(nanoseconds)
  }

  /**
   * Simple waitable timeout to sleep the process
   *
   * Example:
   *
   * ```ts
   * // In milliseconds
   * await ProcessMeasurer.sleep(1000)
   *
   * ```
   *
   * */
  public static async sleep(time: number): Promise<void> {
    return sleep(time)
  }
}
