import { Measurement } from '../src'

describe('Measurement', (): void => {
  it('receives nanoseconds and sets time values', async (): Promise<void> => {
    const measurement = new Measurement(9351234567890n)

    expect(Number(measurement.hours)).toBe(2)
    expect(Number(measurement.minutes)).toBe(35)
    expect(Number(measurement.seconds)).toBe(51)
    expect(Number(measurement.milliseconds)).toBe(234)
  })

  it('can be converted into a formated string', async (): Promise<void> => {
    let measurement = new Measurement(9351234567890n)

    expect(measurement.toString()).toEqual('02hrs 35min 51.234sec')
    expect(measurement.toString('Condensed')).toEqual('02:35:51.234')
    expect(measurement.toString('Human')).toEqual('02hrs 35min 51.234sec')
    expect(measurement.toString('Expressive')).toEqual('02 Hours, 35 Minutes, and 51.234 Seconds')

    measurement = new Measurement(351234567890n)

    expect(measurement.toString()).toEqual('05min 51.234sec')
    expect(measurement.toString('Condensed')).toEqual('05:51.234')
    expect(measurement.toString('Human')).toEqual('05min 51.234sec')
    expect(measurement.toString('Expressive')).toEqual('05 Minutes, and 51.234 Seconds')

    measurement = new Measurement(51234567890n)

    expect(measurement.toString()).toEqual('51.234sec')
    expect(measurement.toString('Condensed')).toEqual('51.234')
    expect(measurement.toString('Human')).toEqual('51.234sec')
    expect(measurement.toString('Expressive')).toEqual('51.234 Seconds')
  })

  it('can be converted into a date', async (): Promise<void> => {
    let measurement = new Measurement(9351234567890n)

    const date = measurement.toDate()

    expect(date.getHours()).toEqual(2)
    expect(date.getMinutes()).toEqual(35)
    expect(date.getSeconds()).toEqual(51)
    expect(date.getMilliseconds()).toEqual(234)
  })
})
