import { TimeFormat } from './Measurement.types'

export default class Measurement {
  public readonly hours: bigint
  public readonly minutes: bigint
  public readonly seconds: bigint
  public readonly milliseconds: bigint

  public constructor(nanoseconds: bigint) {
    let currentNanoseconds = nanoseconds

    this.hours = currentNanoseconds / 3600000000000n
    currentNanoseconds = currentNanoseconds - this.hours * 3600000000000n

    this.minutes = currentNanoseconds / 60000000000n
    currentNanoseconds = currentNanoseconds - this.minutes * 60000000000n

    this.seconds = currentNanoseconds / 1000000000n
    currentNanoseconds = currentNanoseconds - this.seconds * 1000000000n

    this.milliseconds = currentNanoseconds / 1000000n
  }

  /** Returns the measured time in a formated string */
  public toString(format: TimeFormat = 'Human'): string {
    switch (format) {
      case 'Condensed':
        return this.getCondenced()
      case 'Human':
        return this.getHuman()
      case 'Expressive':
        return this.gerExpressive()
    }
  }

  /** Returns the measured time in a formated string */
  public toDate(): Date {
    return new Date(0, 0, 0, Number(this.hours), Number(this.minutes), Number(this.seconds), Number(this.milliseconds))
  }

  private getCondenced(): string {
    if (this.hours !== 0n) {
      return `${this.pad(this.hours)}:${this.pad(this.minutes)}:${this.pad(this.seconds)}.${this.pad(this.milliseconds, 3)}`
    } else if (this.minutes !== 0n) {
      return `${this.pad(this.minutes)}:${this.pad(this.seconds)}.${this.pad(this.milliseconds, 3)}`
    } else {
      return `${this.seconds}.${this.pad(this.milliseconds, 3)}`
    }
  }

  private getHuman(): string {
    if (this.hours !== 0n) {
      return `${this.pad(this.hours)}hrs ${this.pad(this.minutes)}min ${this.pad(this.seconds)}.${this.pad(this.milliseconds, 3)}sec`
    } else if (this.minutes !== 0n) {
      return `${this.pad(this.minutes)}min ${this.pad(this.seconds)}.${this.pad(this.milliseconds, 3)}sec`
    } else {
      return `${this.pad(this.seconds)}.${this.pad(this.milliseconds, 3)}sec`
    }
  }

  private gerExpressive(): string {
    if (this.hours !== 0n) {
      return `${this.pad(this.hours)} Hours, ${this.pad(this.minutes)} Minutes, and ${this.pad(this.seconds)}.${this.pad(this.milliseconds, 3)} Seconds`
    } else if (this.minutes !== 0n) {
      return `${this.pad(this.minutes)} Minutes, and ${this.pad(this.seconds)}.${this.pad(this.milliseconds, 3)} Seconds`
    } else {
      return `${this.pad(this.seconds)}.${this.pad(this.milliseconds, 3)} Seconds`
    }
  }

  private pad(num: bigint, places: number = 2): string {
    return String(num).padStart(places, '0')
  }
}
