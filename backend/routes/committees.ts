import express from 'express'
import {
	getCommittees,
	acceptAdmissions,
} from 'controllers/committeeController'
import authorization from 'utils/authorizationMiddleware'

const committeeRouter = express.Router()

// @route GET /committees
// @description Get all committees
// @access Public
committeeRouter.get('/', getCommittees)

// @route PUT /committees/:slug/accept-admissions
// @description Toggle open/close admission for committee by slug
// @access Private
committeeRouter.put('/:slug/accept-admissions', authorization, acceptAdmissions)

export default committeeRouter
