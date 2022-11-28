import { TimeFormat } from './Measurement.types'

export default class Measurement {
  public readonly hours: number
  public readonly minutes: number
  public readonly seconds: number
  public readonly milliseconds: number

  public constructor(nanoseconds: bigint) {
    let currentNanoseconds = nanoseconds

    this.hours = Number(currentNanoseconds / 3600000000000n)
    currentNanoseconds = currentNanoseconds - BigInt(Math.floor(this.hours)) * 3600000000000n

    this.minutes = Number(currentNanoseconds / 60000000000n)
    currentNanoseconds = currentNanoseconds - BigInt(Math.floor(this.minutes)) * 60000000000n

    this.seconds = Number(currentNanoseconds / 1000000000n)
    currentNanoseconds = currentNanoseconds - BigInt(Math.floor(this.seconds)) * 1000000000n

    this.milliseconds = Number(currentNanoseconds) / 1000000
  }

  /** Returns the measured time in a formatted string */
  public toString(format: TimeFormat = 'Human'): string {
    switch (format) {
      case 'Condensed':
        return this.getCondensed()
      case 'Human':
        return this.getHuman()
      case 'Expressive':
        return this.gerExpressive()
    }
  }

  /** Returns the measured time in a formatted string */
  public toDate(): Date {
    return new Date(0, 0, 0, this.hours, this.minutes, this.seconds, this.milliseconds)
  }

  private getCondensed(): string {
    if (this.hours !== 0) {
      return `${this.pad(this.hours)}:${this.pad(this.minutes)}:${this.pad(this.seconds)}.${this.pad(this.milliseconds, 3)}`
    } else if (this.minutes !== 0) {
      return `${this.pad(this.minutes)}:${this.pad(this.seconds)}.${this.pad(this.milliseconds, 3)}`
    } else if (this.seconds !== 0) {
      return `${this.seconds}.${this.pad(this.milliseconds, 3)}`
    } else {
      return `${this.pad(this.milliseconds, 3, 2)}`
    }
  }

  private getHuman(): string {
    if (this.hours !== 0) {
      return `${this.hours}hrs ${this.minutes}min ${this.seconds}.${this.pad(this.milliseconds, 3)}sec`
    } else if (this.minutes !== 0) {
      return `${this.minutes}min ${this.seconds}.${this.pad(this.milliseconds, 3)}sec`
    } else if (this.seconds !== 0) {
      return `${this.seconds}.${this.pad(this.milliseconds, 3)}sec`
    } else {
      return `${this.pad(this.milliseconds, 3, 2)}ms`
    }
  }

  private gerExpressive(): string {
    if (this.hours !== 0) {
      return `${this.hours} Hours, ${this.minutes} Minutes, and ${this.seconds}.${this.pad(this.milliseconds, 3)} Seconds`
    } else if (this.minutes !== 0) {
      return `${this.minutes} Minutes, and ${this.seconds}.${this.pad(this.milliseconds, 3)} Seconds`
    } else if (this.seconds !== 0) {
      return `${this.seconds}.${this.pad(this.milliseconds, 3)} Seconds`
    } else {
      return `${this.pad(this.milliseconds, 3, 2)} Milliseconds`
    }
  }

  private pad(num: number, places = 2, fixPositions = 0): string {
    return num.toFixed(fixPositions).padStart(places, '0')
  }
}
