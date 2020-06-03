import { Request, Response, Router } from 'express'
import { OK } from 'http-status-codes'
import { authenticate, RequestWithAuth } from '../Middleware'
import jwt from 'jsonwebtoken'
import UserDao from '@daos/User/UserDao'
import {API} from '../Config'
import Debug from "debug"
const debug = Debug("humidity-keeper:user")

const router = Router()
const userDao = new UserDao()

function makeToken(user) {
  debug(`login userId=${user} API.authSecret=${API.authSecret}`)
  return jwt.sign(user, API.authSecret, {expiresIn: '30 days'}) // expires in 30d
}

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/current-user', authenticate, async (req: RequestWithAuth, res: Response) => {
    return res.status(OK).json({ data: req.user })
})

router.post('/login', async (req: Request, res: Response) => {
  const { userId, password } = req.body
  debug(`login userId=${userId} password=${password}`)
  try {
    const user = await userDao.login(userId, password)
    if (user) {
      return res.status(OK).json({ data: user, token: makeToken(user) })
    } else {
      return res.status(OK).json({ error: { code: 400, message: 'authentication failed'} })
    }
  }
  catch (err) {
    debug('exception:', err)
    return res.status(OK).json({ error: { code: 400, message: 'authentication failed'} })
  }
})

router.post('/password', authenticate, async (req: RequestWithAuth, res: Response) => {
  const { password } = req.body
  const user = req.user
  debug(`password id=${user.id} password=${password}`)
  let result = await userDao.password(user.id, password)
  if (result === null) {
    return res.status(OK).json({ error: { code: 400, message: 'password not changed'} })
  } else {
    return res.status(OK).json({ data: result })
  }
})

export default router
