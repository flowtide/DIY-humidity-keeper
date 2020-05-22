import Debug from "debug"
const debug = Debug("humidity-keeper:serial-actuator")
//import * as SerialPort from 'serialport'
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'
import events from 'events'

let em = new events.EventEmitter()

async function readAsync() : Promise<void> {
  const promise = new Promise<void>((resolve, reject) => {
    em.once('dataReady', (data) => {
      resolve(data)
    })
  })
  return promise
}

class SerialActuator {
    private port: SerialPort
    private parser: any

    constructor(devicePort: string, baudRate: number) {
        debug(`SerialPort open: port=${devicePort} baudRate=${baudRate}`)
        this.port = new SerialPort(devicePort, { baudRate: baudRate, dataBits: 8, stopBits: 1, parity: 'none' })
        this.parser = this.port.pipe(new Readline({ delimiter: '\r' }))
        debug('open ok')
        this.parser.on('data', (data:any) => {
            debug('Serial Data: ', data)
            em.emit('dataReady', data)
        })

        setTimeout(() => {
          debug('Send test message to port')
          this.port.write('date\r\n')
        }, 500)
    }

    public async write(command:string): Promise<void> {
      debug(`SerialPort write: ${command}`)
      this.port.write(command)
      return readAsync()
    }

    public close(): void {
        this.port.close()
    }
}

export default SerialActuator
