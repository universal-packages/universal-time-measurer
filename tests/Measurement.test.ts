import { Measurement } from '../src'

describe(Measurement, (): void => {
  it('receives nanoseconds and sets time values', async (): Promise<void> => {
    const measurement = new Measurement(9351234567890n)

    expect(measurement.hours).toBe(2)
    expect(measurement.minutes).toBe(35)
    expect(measurement.seconds).toBe(51)
    expect(measurement.milliseconds).toBe(234.56789)
  })

  it('can be converted into a formatted string', async (): Promise<void> => {
    let measurement = new Measurement(9305234567890n)

    expect(measurement.toString()).toEqual('2hrs 35min 5.235sec')
    expect(measurement.toString('Condensed')).toEqual('02:35:05.235')
    expect(measurement.toString('Human')).toEqual('2hrs 35min 5.235sec')
    expect(measurement.toString('Expressive')).toEqual('2 Hours, 35 Minutes, and 5.235 Seconds')

    measurement = new Measurement(305234567890n)

    expect(measurement.toString()).toEqual('5min 5.235sec')
    expect(measurement.toString('Condensed')).toEqual('05:05.235')
    expect(measurement.toString('Human')).toEqual('5min 5.235sec')
    expect(measurement.toString('Expressive')).toEqual('5 Minutes, and 5.235 Seconds')

    measurement = new Measurement(5234567890n)

    expect(measurement.toString()).toEqual('5.235sec')
    expect(measurement.toString('Condensed')).toEqual('5.235')
    expect(measurement.toString('Human')).toEqual('5.235sec')
    expect(measurement.toString('Expressive')).toEqual('5.235 Seconds')

    measurement = new Measurement(4567890n)

    expect(measurement.toString()).toEqual('4.57ms')
    expect(measurement.toString('Condensed')).toEqual('4.57')
    expect(measurement.toString('Human')).toEqual('4.57ms')
    expect(measurement.toString('Expressive')).toEqual('4.57 Milliseconds')
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
