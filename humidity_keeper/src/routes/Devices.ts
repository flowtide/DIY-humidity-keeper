import { Request, Response, Router } from 'express'
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes'
import { ParamsDictionary } from 'express-serve-static-core'

import DeviceDao from '@daos/Device/DeviceDao'
import ReadingDao from '@daos/Reading/ReadingDao'
import RuleDao from '@daos/Rule/RuleDao'
import Reading, { IReading } from '@entities/Reading';
import { paramMissingError } from '@shared/constants'
import Control, {lightMap} from '../control'
import Debug from 'debug'
import logger from '@shared/Logger'
import { read } from 'fs'
import { IDevice } from '@entities/Device'
import { IRule } from '@entities/Rule'
import Moment from 'moment'

const debug = Debug("humidity-keeper:devices")

const router = Router()
const deviceDao = new DeviceDao()
const readingDao = new ReadingDao()
const ruleDao = new RuleDao()

const serialBaudRate = 9600

async function openAllActuators() {
  const devices = await deviceDao.getAll()
  for (let device of devices) {
    if (device.type == 1) {
      if (!Control.DeviceIsExist(device.address)) {
        debug(`<openAllActuators>: address=${device.address}`)
        Control.DeviceOpen(device.address, serialBaudRate)
      }
    }
  }
}

function isRuleActive(rule: IRule) : boolean {
  let now = Moment()
  let dayOfWeek = now.day()

  if (rule.ctrlWeeks.indexOf(dayOfWeek + '') < 0) {
    debug(`${dayOfWeek} not in ctrlWeeks`)
    return false
  }

  let hhmmss = now.format("HH:mm:ss")

  if (hhmmss < rule.ctrlBegin || hhmmss > rule.ctrlEnd) {
    debug(`${hhmmss} not between ctrlBegin and ctrlEnd`)
    return false
  }

  return true
}

async function checkRules(reading: IReading, device: IDevice) {
  const rule = await ruleDao.findOne('sensorId', device.id)

  if (!rule) {
    debug(`Rule not found: sensorId=${device.id}`)
    return
  }

  const actuatorDevice = await deviceDao.findOne('id', rule.actuatorId)

  if (!actuatorDevice) {
    debug(`Rule not found: actuatorId=${rule.actuatorId}`)
    return
  }

  if (rule.ctrlLight) {
    let lightOn = -1
    if (reading.humidity < rule.humidityThreshold) {
      lightOn = 1
      debug(`lightOn humidity=${reading.humidity} humidity=${rule.humidityThreshold}`)
    } else if (reading.humidity > rule.humidityThreshold + 4) {
      debug(`lightOff humidity=${reading.humidity} humidity=${rule.humidityThreshold}`)
      lightOn = 0
    }

    if (lightOn != -1) {
      let isOn = (lightOn == 1)
      if (Control.DeviceNeedLightOnOff(actuatorDevice.address, isOn)) {
        Control.DeviceLightOnOff(actuatorDevice.address, isOn)
        return  // 시리얼에 연속해서 보내면 안됨으로 Light 제어 수행하는 경우 바로 끝냄, 다음 리포트에 파워 제어 들어갈수 있음
      }
    }
  }

  if (rule.ctrlPower) {
    if (!isRuleActive(rule)) {
      debug(`Rule disabled: sensorId=${device.id}`)
      return
    }

    if (reading.humidity > rule.humidityThreshold) {
      return
    }
    let checkMoment = Moment().subtract(20, 'hours')
    let ctrlAt = Moment(rule.ctrlAt)
    if (!ctrlAt.isValid() || checkMoment.isAfter(ctrlAt)) {
      debug(`DeviceSendPowerKey ${ctrlAt.format()}`)
      Control.DeviceSendPowerKey(actuatorDevice.address)
      rule.ctrlAt = new Date()
      ruleDao.update(rule)
    } else {
      //debug(`no deed to power off ${ctrlAt.format()}`)
    }
  }

}

// Open All Actuator
setTimeout(openAllActuators, 2000)
  
/******************************************************************************
 *                      Get All Devices - "GET /api/devices/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const devices = await deviceDao.getAll()
    return res.status(OK).json({data: devices})
})


/******************************************************************************
 *                       Add One - "POST /api/devices/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    const { device } = req.body
    if (!device) {
        debug('device is empty')
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        })
    }
    const addedDevice = await deviceDao.add(device)
    if (device.type == 1) {
      debug(`actuator port open...: ${device.address}`)
      Control.DeviceOpen(device.address, serialBaudRate)
    }
    return res.status(CREATED).json({data: addedDevice})
})


/******************************************************************************
 *                       Update - "PUT /api/devices/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    const { device } = req.body
    if (!device) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        })
    }

    const prevDevice = await deviceDao.getOne(device.id)
    const result = await deviceDao.update(device)
    if (device.type == 1 && prevDevice?.address != device.address) {
      debug(`actuator port changed: ${prevDevice?.address} -> ${device.address}`)
      if (prevDevice?.address) {
        if (Control.DeviceIsExist(prevDevice?.address as string))
          Control.DeviceClose(prevDevice?.address as string)
      }
      Control.DeviceOpen(device.address, serialBaudRate)
    }

    return res.status(OK).json({ data: result })
})


/******************************************************************************
 *                    Delete - "DELETE /api/devices/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary
    const result = await deviceDao.delete(id)
    return res.status(OK).json({ data: result })
})

router.get('/notify', async (req: Request, res: Response) => {
  const { mac, temperature, humidity, battery } = req.query
  if (!mac || !temperature || !humidity || !battery) {
      logger.warn(`[notify] insufficient param: mac=${mac} temperature=${temperature} humidity=${humidity} battery=${battery}`)
      return res.status(BAD_REQUEST).json({
          error: paramMissingError,
      })
  }
  
  const device = await deviceDao.findOne('address', mac as string)
  if (!device) {
    let error = `'mac' address not registred: ${mac}`
    logger.warn(`[notify] can't update sensor data: ${error}`)
    return res.status(BAD_REQUEST).json({
        error: error,
    })
  }

  const reading = new Reading(null)
  reading.created = new Date()
  reading.deviceId = device.id
  reading.temperature = Number(temperature)
  reading.humidity = Number(humidity)
  reading.battery = Number(battery)
  const result = await readingDao.add(reading)

  checkRules(reading, device)

  return res.status(OK).json({ data: result })
})

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router
