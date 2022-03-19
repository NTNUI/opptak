import express from 'express'
import {
	getCommittees,
	acceptApplicants,
} from '../controllers/committeeController'

const committeeRouter = express.Router()

// @route GET committees
// @description Get all committees
// @access Public
committeeRouter.get('/', getCommittees)

// @route PUT /committees/:slug/accept-applications
// @description Open committee for applications
// @access Private
committeeRouter.put('/:slug/accept-applications', acceptApplicants)

export default committeeRouter
