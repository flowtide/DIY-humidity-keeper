import { Request, Response, Router } from 'express'
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes'
import { ParamsDictionary } from 'express-serve-static-core'

import DeviceDao from '@daos/Device/DeviceDao'
import ReadingDao from '@daos/Reading/ReadingDao'
import Reading from '@entities/Reading';
import { paramMissingError } from '@shared/constants'
import Control, { DeviceClose } from '../control'
import Debug from 'debug'
import logger from '@shared/Logger'
import { read } from 'fs'

const debug = Debug("humidity-keeper:devices")

const router = Router()
const deviceDao = new DeviceDao()
const readingDao = new ReadingDao()

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
      Control.DeviceClose(prevDevice?.address as string)
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

  return res.status(OK).json({ data: result })
})

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router
