import { Request, Response, Router } from 'express'
import { OK } from 'http-status-codes';
import { authenticate, RequestWithAuth } from '../Middleware'
import Control from '../control'
import Debug from "debug"
const debug = Debug("humidity-keeper:routes")

const router = Router()

router.post('/serial-write', async (req: RequestWithAuth, res: Response) => {
    const { message } = req.body
    debug(`Device Write: ${message.address} -> ${message.text}`)
    var result = await Control.DeviceWrite(message.address, message.text)
    debug('result:', result)
    return res.status(OK).json({ data: result })
})

router.post('/light-onoff', async (req: RequestWithAuth, res: Response) => {
    const { message } = req.body
    debug(`DeviceLightOnOff: ${message.address} -> ${message.isOn}`)
    var result = await Control.DeviceLightOnOff(message.address, message.isOn)
    debug('result:', result)
    return res.status(OK).json({ data: result })
})

router.get('/light-status', async (req: RequestWithAuth, res: Response) => {
    const { address } = req.query
    debug('address:', address)
    var result = await Control.DeviceLightStatus(address as string)
    debug('result:', result)
    return res.status(OK).json({ data: result })
})

router.post('/send-power-key', async (req: RequestWithAuth, res: Response) => {
    const { message } = req.body
    debug(`DeviceLightOnOff: ${message.address}`)
    var result = await Control.DeviceSendPowerKey(message.address)
    debug('result:', result)
    return res.status(OK).json({ data: result })
})

export default router
