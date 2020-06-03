import Debug from "debug"
const debug = Debug("humidity-keeper:serial-actuator")
import SerialActuator from './SerialActuator'

let actuators = {}

export class LightStatus {

  public lightStatus: number
  public updateTime: Date

  constructor() {
    this.lightStatus = -1
    this.updateTime = new Date()
  }

  public UpdateLightStatus(isOn: boolean) : void {
    this.lightStatus = isOn ? 1 : 0
    this.updateTime = new Date()
  }

  public NeedToControl(isOn: boolean) : boolean {
    if (this.lightStatus == -1)
      return true

    if ((this.lightStatus == 1) != isOn)
      return true

    return false
  }
}

export var lightMap :  { [portNumber: string]: LightStatus } = {}

export function DeviceOpen(portNumber: string, baudRate: number) {
  actuators[portNumber] = new SerialActuator(portNumber, baudRate)
  if (!(portNumber in lightMap))
    lightMap[portNumber] = new LightStatus()
}

export function DeviceClose(portNumber: string) {
  actuators[portNumber].close()
  delete actuators[portNumber]
}

export async function DeviceWrite(portNumber: string, data: string) {
  if (!DeviceIsExist(portNumber))
    throw new Error(`Actuator port not opened: ${portNumber}`)
  let result = await actuators[portNumber].write(data)
  debug('result:', result)
  return result
}

export function DeviceIsExist(portNumber: string): boolean {
  return portNumber in actuators
}

export function DeviceLightStatus(portNumber: string):number {
  if (!DeviceIsExist(portNumber))
    throw new Error(`Actuator port not opened: ${portNumber}`)

  return lightMap[portNumber].lightStatus
}

export function DeviceNeedLightOnOff(portNumber: string, isOn: boolean):boolean {
  if (!DeviceIsExist(portNumber))
    throw new Error(`Actuator port not opened: ${portNumber}`)

  return lightMap[portNumber].NeedToControl(isOn)
}

export async function DeviceLightOnOff(portNumber: string, isOn: boolean) {
  if (!DeviceIsExist(portNumber))
    throw new Error(`Actuator port not opened: ${portNumber}`)

  let data = isOn ? 'gpio.high 12\r' : 'gpio.low 12\r'
  let result = await actuators[portNumber].write(data)
  
  lightMap[portNumber].UpdateLightStatus(isOn)

  debug('result:', result)
  return result
}

export async function DeviceSendPowerKey(portNumber: string) {
  if (!DeviceIsExist(portNumber))
    throw new Error(`Actuator port not opened: ${portNumber}`)

  let data = 'ir.NEC 40FF00FF\r'
  let result = await actuators[portNumber].write(data)
  
  debug('result:', result)
  return result
}

export default {
  DeviceOpen,
  DeviceClose,
  DeviceWrite,
  DeviceIsExist,
  DeviceLightStatus,
  DeviceNeedLightOnOff,
  DeviceLightOnOff,
  DeviceSendPowerKey,
}
