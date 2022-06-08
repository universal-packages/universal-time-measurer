import ProcessMeasurer from '../src'

describe('ProcessMeasurer', (): void => {
  it('starts and ends a measurement', async (): Promise<void> => {
    const processMeasurer = new ProcessMeasurer()

    processMeasurer.start()
    await ProcessMeasurer.sleep(500)

    const measurement = processMeasurer.finish()

    expect(measurement.milliseconds).toBeGreaterThanOrEqual(500n)
  })

  it('can measure with diffenret instances', async (): Promise<void> => {
    const processMeasurer = new ProcessMeasurer()
    const secondaryProcessMeasurer = new ProcessMeasurer()

    processMeasurer.start()
    await ProcessMeasurer.sleep(500)

    secondaryProcessMeasurer.start()
    await ProcessMeasurer.sleep(600)

    const measurement = processMeasurer.finish()
    const secondaryMeasurement = secondaryProcessMeasurer.finish()

    expect(measurement.seconds).toBe(1n)
    expect(secondaryMeasurement.seconds).toBe(0n)
    expect(secondaryMeasurement.milliseconds).toBeGreaterThanOrEqual(600n)
  })

  it('throws if calling finish without calling start first', async (): Promise<void> => {
    const processMeasurer = new ProcessMeasurer()

    expect((): void => {
      processMeasurer.finish()
    }).toThrow('Process measurer finished without previously started')
  })
})
