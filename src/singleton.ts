import Measurement from './Measurement'
import ProcessMeasurer from './ProcessMeasurer'

const PROCESS_MEASURER = new ProcessMeasurer()

export function start(): void {
  PROCESS_MEASURER.start()
}

export function finish(): Measurement {
  return PROCESS_MEASURER.finish()
}
