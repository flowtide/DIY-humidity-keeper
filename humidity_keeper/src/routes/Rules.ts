import { Request, Response, Router } from 'express'
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes'
import { ParamsDictionary } from 'express-serve-static-core'

import RuleDao from '@daos/Rule/RuleDao'
import { paramMissingError } from '@shared/constants'
import Debug from 'debug'
const debug = Debug("humidity-keeper:rules")
import logger from '@shared/Logger'

const router = Router()
const ruleDao = new RuleDao()

  
/******************************************************************************
 *                      Get All Rules - "GET /api/rules/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const rules = await ruleDao.getAll()
    return res.status(OK).json({data: rules})
})

router.get('/one', async (req: Request, res: Response) => {
  const { id } = req.query
  const rule = await ruleDao.getOne(id as string)
  return res.status(OK).json({data: rule})
})

/******************************************************************************
 *                       Add One - "POST /api/rules/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    const { rule } = req.body
    if (!rule) {
        debug('rule is empty')
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        })
    }
    const addedRule = await ruleDao.add(rule)

    return res.status(CREATED).json({data: addedRule})
})


/******************************************************************************
 *                       Update - "PUT /api/rules/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    const { rule } = req.body
    if (!rule) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        })
    }

    const result = await ruleDao.update(rule)

    return res.status(OK).json({ data: result })
})


/******************************************************************************
 *                    Delete - "DELETE /api/rules/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary
    const result = await ruleDao.delete(id)
    return res.status(OK).json({ data: result })
})

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router
