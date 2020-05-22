import {Request, Response, NextFunction} from 'express'
import Debug from "debug"
const debug = Debug("humidity-keeper:auth")
import jwt from 'jsonwebtoken'
import {API} from './Config'

// tslint:disable-next-line no-any
export type PromiseMiddleware = (req: Request, res: Response) => Promise<any>

export const promise = (middleware: PromiseMiddleware) => (
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await middleware(req, res)

      if (result) {
        res.json(result)
      } else {
        next()
      }
    } catch (err) {
      next(err)
    }
  }
)

export interface RequestWithAuth extends Request {
  user?: any
}

export const authenticate = (req: RequestWithAuth, res: Response, next: NextFunction) => {
  let token = <string>(req.headers['x-access-token'] || req.headers['authorization']) // Express headers are auto converted to lowercase

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, API.authSecret, (err, decoded) => {
      if (err) {
        debug('verify error:', err)
        res.json({
          error: {
            code: 403,
            message: 'Token is not valid'
          }
        })
      } else {
        //debug('decoded jwt:', decoded)
        req.user = decoded
        next()
      }
    })
  } else {
    debug('Auth token is not supplied')
    res.json({
      error: {
        code: 403,
        message: 'access forbidden'
      }
    })
  }
}

export default {promise, authenticate}
