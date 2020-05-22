import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { authenticate, RequestWithAuth } from '../Middleware'

const router = Router()


/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/current-user', authenticate, async (req: RequestWithAuth, res: Response) => {
    return res.status(OK).json({ data: req.user })
});

export default router
