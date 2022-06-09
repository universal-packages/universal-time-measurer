import TimeMeasurer from '../src'

describe('TimeMeasurer', (): void => {
  it('starts and ends a measurement', async (): Promise<void> => {
    const processMeasurer = new TimeMeasurer()

    processMeasurer.start()
    await TimeMeasurer.sleep(500)

    const measurement = processMeasurer.finish()

    expect(measurement.milliseconds).toBeGreaterThanOrEqual(500)
  })

  it('can measure with diffenret instances', async (): Promise<void> => {
    const processMeasurer = new TimeMeasurer()
    const secondaryTimeMeasurer = new TimeMeasurer()

    processMeasurer.start()
    await TimeMeasurer.sleep(500)

    secondaryTimeMeasurer.start()
    await TimeMeasurer.sleep(600)

    const measurement = processMeasurer.finish()
    const secondaryMeasurement = secondaryTimeMeasurer.finish()

    expect(measurement.seconds).toBe(1)
    expect(secondaryMeasurement.seconds).toBe(0)
    expect(secondaryMeasurement.milliseconds).toBeGreaterThanOrEqual(600)
  })

  it('throws if calling finish without calling start first', async (): Promise<void> => {
    const processMeasurer = new TimeMeasurer()

    expect((): void => {
      processMeasurer.finish()
    }).toThrow('Time measurer finished without previously started')
  })
})
