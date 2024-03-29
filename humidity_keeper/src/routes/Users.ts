import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

//import UserDao from '@daos/User/UserDao.mock';
import UserDao from '@daos/User/UserDao';
import { paramMissingError } from '@shared/constants';

// Init shared
const router = Router();
const userDao = new UserDao();


/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const users = await userDao.getAll();
    return res.status(OK).json({ data: users });
});

router.get('/get/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    const user = await userDao.getOne(id);
    return res.status(OK).json({ data: user });
});

/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    const newUser = await userDao.add(user);
    return res.status(CREATED).json({ data: newUser });
});


/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    const result = await userDao.update(user);
    return res.status(OK).json({ data: result });
});


/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    const result = await userDao.delete(id);
    return res.status(OK).json({ data: result });
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
