import { Router } from 'express'
import AuthRouter from './Auth'
import UserRouter from './Users'
import DeviceRouter from './Devices'
import ReadingRouter from './Readings'
import ActuatorRouter from './Actuator'

// Init router and path
const router = Router()

// Add sub-routes
router.use('/auth', AuthRouter)
router.use('/users', UserRouter)
router.use('/devices', DeviceRouter)
router.use('/readings', ReadingRouter)
router.use('/actuators', ActuatorRouter)

// Export the base-router
export default router
