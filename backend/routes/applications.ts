import express from 'express'
import {
	getApplicationById,
	getApplications,
	postApplication,
	wipeApplications,
} from '../controllers/applicationController'
import {
	getAdmissionPeriod,
	putAdmissionPeriod,
	getAdmissionPeriodStatus,
} from '../controllers/admissionPeriodController'
import authorization from '../utils/authorizationMiddleware'

const applicationRouter = express.Router()

// @route GET applications
// @description Get all applications that user has access to
// @access Private
applicationRouter.get('/', authorization, getApplications)

// @route POST applications
// @description Add application
// @access Public
applicationRouter.post('/', postApplication)

// @route GET applications/period
// @description Get the application period
// @access Public
applicationRouter.get('/period', getAdmissionPeriod)

// @route PUT applications/period
// @description Update/set application period
// @access Private
applicationRouter.put('/period', authorization, putAdmissionPeriod)

// @route GET applications/period/active
// @description Get if admission period is active
// @access Public
applicationRouter.get('/period/active', getAdmissionPeriodStatus)

// @route GET applications/:application_id
// @description Get application by id if user has access
// @access Private
applicationRouter.get('/:application_id', authorization, getApplicationById)

// @route DELETE applications
// @description Delete all applications for all committees
// @access Private
applicationRouter.delete('/', authorization, wipeApplications)

export default applicationRouter
