import { TimeFormat } from './Measurement.types'

export class Measurement {
  private _nanoseconds: bigint
  private _milliseconds: number
  private _seconds: number
  private _minutes: number
  private _hours: number

  public get nanoseconds(): bigint {
    return this._nanoseconds
  }

  public get milliseconds(): number {
    return this._milliseconds
  }

  public get seconds(): number {
    return this._seconds
  }

  public get minutes(): number {
    return this._minutes
  }

  public get hours(): number {
    return this._hours
  }

  public constructor(nanoseconds: bigint) {
    this._nanoseconds = nanoseconds

    let currentNanoseconds = nanoseconds

    this._hours = Number(currentNanoseconds / 3600000000000n)
    currentNanoseconds = currentNanoseconds - BigInt(Math.floor(this._hours)) * 3600000000000n

    this._minutes = Number(currentNanoseconds / 60000000000n)
    currentNanoseconds = currentNanoseconds - BigInt(Math.floor(this._minutes)) * 60000000000n

    this._seconds = Number(currentNanoseconds / 1000000000n)
    currentNanoseconds = currentNanoseconds - BigInt(Math.floor(this._seconds)) * 1000000000n

    this._milliseconds = Number(currentNanoseconds) / 1000000
  }

  /**
   * Convert the measurement to a primitive value
   * @param hint - The hint to convert the measurement to
   * @returns The measurement as a primitive value
   */
  [Symbol.toPrimitive](hint: 'bigint' | 'number' | 'string' | 'default'): bigint | number | string {
    if (hint === 'bigint') {
      return this.nanoseconds
    } else if (hint === 'number' || hint === 'default') {
      // For numeric operations and comparisons, return nanoseconds as number
      return Number(this.nanoseconds)
    } else if (hint === 'string') {
      return this.toString()
    }
    return Number(this.nanoseconds)
  }

  /**
   * Add another measurement to this one
   * @param other - The measurement to add
   * @returns A new measurement with the sum of both times
   */
  public add(other: Measurement): Measurement {
    return new Measurement(this.nanoseconds + other.nanoseconds)
  }

  /**
   * Subtract another measurement from this one
   * @param other - The measurement to subtract
   * @returns A new measurement with the difference
   */
  public subtract(other: Measurement): Measurement {
    const result = this.nanoseconds - other.nanoseconds
    return new Measurement(result < 0n ? 0n : result)
  }

  /**
   * Check if this measurement is equal to another
   * @param other - The measurement to compare with
   * @returns True if measurements are equal
   */
  public equals(other: Measurement): boolean {
    return this.nanoseconds === other.nanoseconds
  }

  /**
   * Check if this measurement is less than another
   * @param other - The measurement to compare with
   * @returns True if this measurement is less than the other
   */
  public lessThan(other: Measurement): boolean {
    return this.nanoseconds < other.nanoseconds
  }

  /**
   * Check if this measurement is greater than another
   * @param other - The measurement to compare with
   * @returns True if this measurement is greater than the other
   */
  public greaterThan(other: Measurement): boolean {
    return this.nanoseconds > other.nanoseconds
  }

  /**
   * Check if this measurement is less than or equal to another
   * @param other - The measurement to compare with
   * @returns True if this measurement is less than or equal to the other
   */
  public lessThanOrEqual(other: Measurement): boolean {
    return this.nanoseconds <= other.nanoseconds
  }

  /**
   * Check if this measurement is greater than or equal to another
   * @param other - The measurement to compare with
   * @returns True if this measurement is greater than or equal to the other
   */
  public greaterThanOrEqual(other: Measurement): boolean {
    return this.nanoseconds >= other.nanoseconds
  }

  /**
   * Convert the measurement to a string
   * @param format - The format to convert the measurement to
   * @returns The measurement as a string
   */
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

  /**
   * Convert the measurement to a date
   * @returns The measurement as a date
   */
  public toDate(): Date {
    return new Date(0, 0, 0, this.hours, this.minutes, this.seconds, this.milliseconds)
  }

  /**
   * Convert the measurement to a condensed string
   *
   * 1000ms = 1.000s
   * 60s = 1m
   * 60m = 1h
   *
   * @returns The measurement as a condensed string
   */
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

  /**
   * Convert the measurement to a human readable string
   *
   * 1000ms = 1.000sec
   * 60s = 1min
   * 60m = 1hrs
   *
   * @returns The measurement as a human readable string
   */
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

  /**
   * Convert the measurement to a expressive string
   *
   * 1000ms = 1.000 Second
   * 60s = 1 Minute
   * 60m = 1 Hour
   *
   * @returns The measurement as a expressive string
   */
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

  /**
   * Pad a number with zeros
   * @param num - The number to pad
   * @param places - The number of places to pad the number to
   * @param fixPositions - The number of positions to fix the number to
   * @returns The padded number
   */
  private pad(num: number, places = 2, fixPositions = 0): string {
    return num.toFixed(fixPositions).padStart(places, '0')
  }
}
