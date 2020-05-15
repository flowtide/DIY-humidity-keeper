import { Router } from 'express';
import UserRouter from './Users';
import DeviceRouter from './Devices';
import ReadingRouter from './Readings';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/devices', DeviceRouter);
router.use('/readings', ReadingRouter);

// Export the base-router
export default router;
