import { sleep, startMeasurement } from '../src'

describe('startMeasurement', (): void => {
  it('starts and ends a measurement as a single instance', async (): Promise<void> => {
    const measurer = startMeasurement()
    await sleep(500)

    const measurement = measurer.finish()
    expect(measurement.milliseconds).toBeGreaterThanOrEqual(500)
  })
})
