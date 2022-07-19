import TimeMeasurer from './TimeMeasurer'

export function startMeasurement(): TimeMeasurer {
  return new TimeMeasurer()
}
