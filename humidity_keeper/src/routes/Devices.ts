import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import DeviceDao from '@daos/Device/DeviceDao';
import { paramMissingError } from '@shared/constants';

const router = Router();
const deviceDao = new DeviceDao();


/******************************************************************************
 *                      Get All Devices - "GET /api/devices/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const devices = await deviceDao.getAll();
    return res.status(OK).json({data: devices});
});


/******************************************************************************
 *                       Add One - "POST /api/devices/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    const { device } = req.body;
    if (!device) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    const addedDevice = await deviceDao.add(device);
    return res.status(CREATED).json({data: addedDevice});
});


/******************************************************************************
 *                       Update - "PUT /api/devices/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    const { device } = req.body;
    if (!device) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    const result = await deviceDao.update(device);
    return res.status(OK).json({ data: result });
});


/******************************************************************************
 *                    Delete - "DELETE /api/devices/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    const result = await deviceDao.delete(id);
    return res.status(OK).json({ data: result });
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
