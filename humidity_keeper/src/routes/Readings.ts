import { Request, Response, Router } from 'express'
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes'
import { ParamsDictionary } from 'express-serve-static-core'

//import ReadingDao from '@daos/Reading/ReadingDao.mock'
import ReadingDao from '@daos/Reading/ReadingDao'
import { paramMissingError } from '@shared/constants'

// Init shared
const router = Router()
const readingDao = new ReadingDao()


/******************************************************************************
 *                      Get All Readings - "GET /api/readings/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
  const { dateFrom, dateTo, limit, orderBy, desc } = req.query
  const readings = await readingDao.getAll(dateFrom.toString(), dateTo.toString(),
    Number(limit), orderBy.toString(), desc ? 'DESC' : 'ASC')
  return res.status(OK).json({data: readings})
})


/******************************************************************************
 *                    Delete - "DELETE /api/readings/delete-range
 ******************************************************************************/

router.delete('/delete-range', async (req: Request, res: Response) => {
  const { fromDate, toDate } = req.query
  const result = await readingDao.deleteRange(fromDate.toString(), toDate.toString())
  return res.status(OK).json({ data: result })
})


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router
