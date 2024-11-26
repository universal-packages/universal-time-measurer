import { TimeMeasurer, sleep } from '../src'

describe(TimeMeasurer, (): void => {
  it('starts and ends a measurement', async (): Promise<void> => {
    const processMeasurer = new TimeMeasurer()
    processMeasurer.start()

    await sleep(500)

    const measurement = processMeasurer.finish()

    expect(measurement.milliseconds).toBeGreaterThanOrEqual(500)
  })

  it('can measure with different instances', async (): Promise<void> => {
    const processMeasurer = new TimeMeasurer()
    processMeasurer.start()

    await sleep(500)

    const secondaryTimeMeasurer = new TimeMeasurer()
    secondaryTimeMeasurer.start()

    await sleep(600)

    const measurement = processMeasurer.finish()
    const secondaryMeasurement = secondaryTimeMeasurer.finish()

    expect(measurement.seconds).toBe(1)
    expect(secondaryMeasurement.seconds).toBe(0)
    expect(secondaryMeasurement.milliseconds).toBeGreaterThanOrEqual(600)
  })

  it('uses performance API when process is not defined', async (): Promise<void> => {
    const originalProcess = global.process
    delete global.process

    const processMeasurer = new TimeMeasurer()
    processMeasurer.start()

    await sleep(500)

    const measurement = processMeasurer.finish()

    expect(measurement.milliseconds).toBeGreaterThanOrEqual(500)

    global.process = originalProcess
  })
})
