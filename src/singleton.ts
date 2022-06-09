import Measurement from './Measurement'
import TimeMeasurer from './TimeMeasurer'

const PROCESS_MEASURER = new TimeMeasurer()

export function start(): void {
  PROCESS_MEASURER.start()
}

export function finish(): Measurement {
  return PROCESS_MEASURER.finish()
}
