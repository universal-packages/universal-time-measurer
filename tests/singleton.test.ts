import { start, finish, sleep } from '../src'

describe('singleton', (): void => {
  it('starts and ends a measurement as a single instance', async (): Promise<void> => {
    start()
    await sleep(500)

    const measurement = finish()
    expect(measurement.milliseconds).toBeGreaterThanOrEqual(500)
  })

  it('can not measure with diffenret instances', async (): Promise<void> => {
    start()
    await sleep(500)

    start()
    await sleep(600)

    const measurement = finish()
    expect(measurement.seconds).toBe(0)
    expect(measurement.milliseconds).toBeGreaterThanOrEqual(600)
  })
})
