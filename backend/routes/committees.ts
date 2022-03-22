import express from 'express'
import {
	getCommittees,
	acceptApplicants,
} from '../controllers/committeeController'
import authorization from '../utils/authorizationMiddleware'

const committeeRouter = express.Router()

// @route GET committees
// @description Get all committees
// @access Public
committeeRouter.get('/', getCommittees)

// @route PUT /committees/:slug/accept-applicants
// @description Open committee for applicants/applications
// @access Private
committeeRouter.put('/:slug/accept-applicants', authorization, acceptApplicants)

export default committeeRouter
