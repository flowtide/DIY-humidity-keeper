import { Request, Response, Router } from 'express'
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes'
import { ParamsDictionary } from 'express-serve-static-core'

//import ReadingDao from '@daos/Reading/ReadingDao.mock'
import ReadingDao from '@daos/Reading/ReadingDao'
import { paramMissingError } from '@shared/constants'
import Debug from "debug"
const debug = Debug("humidity-keeper:readings")

// Init shared
const router = Router()
const readingDao = new ReadingDao()


/******************************************************************************
 *                      Get All Readings - "GET /api/readings/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
  const { dateFrom, dateTo, limit, orderBy, desc } = req.query
  const orderByParam = Number(desc) ? 'DESC' : 'ASC'

  debug(`desc=${desc} orderByParam=${orderByParam}`)
  const readings = await readingDao.getAll(dateFrom as string, dateTo as string,
    Number(limit), orderBy as string, orderByParam)
  return res.status(OK).json({data: readings})
})

router.get('/recent-data', async (req: Request, res: Response) => {
  const { deviceId } = req.query
  const reading = await readingDao.getRecent(deviceId as string)
  return res.status(OK).json({data: reading})
})


/******************************************************************************
 *                    Delete - "DELETE /api/readings/delete-range
 ******************************************************************************/

router.delete('/delete-range', async (req: Request, res: Response) => {
  const { fromDate, toDate } = req.query
  const result = await readingDao.deleteRange(fromDate as string, toDate as string)
  return res.status(OK).json({ data: result })
})


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router
