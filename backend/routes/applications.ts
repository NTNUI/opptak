import express from 'express'
import {
	getApplicationById,
	getApplications,
	postApplication,
	putApplicationStatus,
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

// @route PUT /:application_id/status/:committee_id
// @description Update an applications status for a committee
// @access Private
applicationRouter.put(
	'/:application_id/status/:committee_id',
	authorization,
	putApplicationStatus
)

// @route GET applications/:application_id
// @description Get application by id if user has access
// @access Private
applicationRouter.get('/:application_id', authorization, getApplicationById)

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

export default applicationRouter
