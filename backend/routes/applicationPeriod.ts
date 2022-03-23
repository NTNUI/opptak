import express from 'express'
import {
	getApplicationPeriod,
	postApplicationPeriod,
	putApplicationPeriod,
	isApplicationPeriodActive,
} from '../controllers/applicationPeriodController'
import authorization from '../utils/authorizationMiddleware'

const applicationPeriodRouter = express.Router()

// @route GET applicationPeriod
// @description Get the application period
// @access Public
applicationPeriodRouter.get('/', getApplicationPeriod)

// @route POST applicationPeriod
// @description Add application period
// @access Public
applicationPeriodRouter.post('/', postApplicationPeriod)

// @route PUT applicationPeriod
// @description Updated application period
// @access Public
applicationPeriodRouter.put('/', authorization, putApplicationPeriod)

// @route GET applicationPeriod/active
// @description Get if application period is open or not
// @access Public
applicationPeriodRouter.get('/active', isApplicationPeriodActive)

export default applicationPeriodRouter
