import express from 'express'
import {
	getApplicationById,
	getApplications,
	postApplication,
	wipeAdmissionData,
} from '../controllers/applicationController'
import {
	getAdmissionPeriod,
	putAdmissionPeriod,
	getAdmissionPeriodStatus,
} from '../controllers/admissionPeriodController'
import authorization from '../utils/authorizationMiddleware'
import applicationQueryValidator from '../utils/applicationQueryMiddleware'

const applicationRouter = express.Router()

// @route GET /applications
// @description Get all applications that user has access to
// @access Private
applicationRouter.get(
	'/',
	authorization,
	applicationQueryValidator(),
	getApplications
)

// @route POST /applications
// @description Post a new application
// @access Public
applicationRouter.post('/', postApplication)

// @route GET /applications/period
// @description Get the current admission period
// @access Public
applicationRouter.get('/period', getAdmissionPeriod)

// @route PUT /applications/period
// @description Update/set admission period
// @access Private
applicationRouter.put('/period', authorization, putAdmissionPeriod)

// @route GET /applications/period/active
// @description Get if admission period is active
// @access Public
applicationRouter.get('/period/active', getAdmissionPeriodStatus)

// @route GET /applications/:application_id
// @description Get application by id if user has access
// @access Private
applicationRouter.get('/:application_id', authorization, getApplicationById)

// @route DELETE /applications
// @description Delete all admission data if user has access
// @access Private
applicationRouter.delete('/', authorization, wipeAdmissionData)

export default applicationRouter
