import { Request, Response, Router } from 'express'
import { OK } from 'http-status-codes';
import { authenticate, RequestWithAuth } from '../Middleware'
import Control from '../control'
import Debug from "debug"
const debug = Debug("humidity-keeper:actuator")

const router = Router()

router.post('/serial-write', async (req: RequestWithAuth, res: Response) => {
    const { message } = req.body
    debug(`Device Write: ${message.address} -> ${message.text}`)
    var result = Control.DeviceWrite(message.address, message.text, message.crlf)
    return res.status(OK).json({ data: result })
})

export default router
