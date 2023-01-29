import TimeMeasurer from './TimeMeasurer'

export function startMeasurement(): TimeMeasurer {
  const measurer = new TimeMeasurer()

  measurer.start()

  return measurer
}
