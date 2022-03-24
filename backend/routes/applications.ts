import express from 'express'
import {
	getApplicationById,
	getApplications,
	postApplication,
} from '../controllers/applicationController'
import {
	getApplicationPeriod,
	putApplicationPeriod,
	isApplicationPeriodActive,
} from '../controllers/applicationPeriodController'
import authorization from '../utils/authorizationMiddleware'

const applicationRouter = express.Router()

// @route GET applications
// @description Get all applications that user has access to
// @access Private
applicationRouter.get('/', authorization, getApplications)

// @route GET applications/period
// @description Get the application period
// @access Public
applicationRouter.get('/period', getApplicationPeriod)

// @route PUT applications/period
// @description Update/set application period
// @access Private
applicationRouter.put('/period', authorization, putApplicationPeriod)

// @route GET applications/period/active
// @description Get if application period is active
// @access Public
applicationRouter.get('/period/active', isApplicationPeriodActive)

// @route GET applications/:application-id
// @description Get application by id if user has access
// @access Private
applicationRouter.get('/:application_id', authorization, getApplicationById)

// @route POST applications
// @description Add application
// @access Public
applicationRouter.post('/', postApplication)

export default applicationRouter
