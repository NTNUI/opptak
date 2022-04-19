import express, { NextFunction, Request, Response } from 'express'
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
import { StatusTypes } from '../utils/enums'
import { stringifyEnum } from '../models/Status'

const { query } = require('express-validator')

const applicationRouter = express.Router()

// @route GET applications
// @description Get all applications that user has access to
// @access Private
applicationRouter.get('/', authorization, [
	query('committee').optional().isInt().withMessage('Must be an integer'),
	query('name').optional().isString().withMessage('Must be a string'),
	query('status').optional().isIn(Object.values(StatusTypes)).withMessage(`The following values are accepted for status: ${stringifyEnum(StatusTypes)}`),
], getApplications)

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
// @description Delete all admission data
// @access Private
applicationRouter.delete('/', authorization, wipeAdmissionData)

export default applicationRouter
