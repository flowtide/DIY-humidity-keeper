import SerialActuator from './SerialActuator'

let actuators = {}

export function DeviceOpen(portNumber: string, baudRate: number) {
  actuators[portNumber] = new SerialActuator(portNumber, baudRate)
}

export function DeviceClose(portNumber: string) {
  actuators[portNumber].close()
  delete actuators[portNumber]
}

export async function DeviceWrite(portNumber: string, data: string, crlf: boolean) {
  if (!DeviceIsExist(portNumber))
    throw new Error(`Actuator port not opened: ${portNumber}`)
  if (crlf)
    data += '\r'
  let result = actuators[portNumber].write(data)
  return result
}

export function DeviceIsExist(portNumber: string): boolean {
  return portNumber in actuators
}

export default {
  DeviceOpen,
  DeviceClose,
  DeviceWrite,
  DeviceIsExist,
}
