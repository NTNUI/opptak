import express from 'express'
import {
	getApplications,
	postApplication,
} from '../controllers/applicationController'

const applicationRouter = express.Router()

// @route GET applications
// @description Get all applications
// @access Public
applicationRouter.get('/', getApplications)

// @route POST applications
// @description Add application
// @access Public
applicationRouter.post('/', postApplication)

export default applicationRouter
