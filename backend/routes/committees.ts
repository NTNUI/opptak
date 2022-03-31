import express from 'express'
import {
	getCommittees,
	acceptAdmissions,
} from '../controllers/committeeController'
import authorization from '../utils/authorizationMiddleware'

const committeeRouter = express.Router()

// @route GET committees
// @description Get all committees
// @access Public
committeeRouter.get('/', getCommittees)

// @route PUT /committees/:slug/accept-admissions
// @description Open/close committee for admissions
// @access Private
committeeRouter.put('/:slug/accept-admissions', authorization, acceptAdmissions)

export default committeeRouter
