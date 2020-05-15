import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

//import ReadingDao from '@daos/Reading/ReadingDao.mock';
import ReadingDao from '@daos/Reading/ReadingDao';
import { paramMissingError } from '@shared/constants';
import logger from '@shared/Logger';

// Init shared
const router = Router();
const readingDao = new ReadingDao();


/******************************************************************************
 *                      Get All Readings - "GET /api/readings/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const readings = await readingDao.getAll();
    return res.status(OK).json({data: readings});
});


/******************************************************************************
 *                       Add One - "get /api/readings/notify"
 ******************************************************************************/

router.get('/notify', async (req: Request, res: Response) => {
    const { mac, temperature, humidity, battery } = req.query;
    if (!mac || !temperature || !humidity || !battery) {
        logger.warn(`[/api/readings/notify] insufficient param: mac=${mac} temperature=${temperature} humidity=${humidity} battery=${battery}`)
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    
    const result = await readingDao.putSensorValues(mac.toString(), Number(temperature), Number(humidity), Number(battery));
    return res.status(CREATED).json({ data: result });
});


/******************************************************************************
 *                    Delete - "DELETE /api/readings/delete-range
 ******************************************************************************/

router.delete('/delete-range', async (req: Request, res: Response) => {
    const { fromDate, toDate } = req.query;
    const result = await readingDao.deleteRange(fromDate.toString(), toDate.toString());
    return res.status(OK).json({ data: result });
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
