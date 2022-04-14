import express from 'express'
import {
	getUserCommittees,
	getUserProfile,
} from '../controllers/userController'
import authorization from '../utils/authorizationMiddleware'

const userRouter = express.Router()

// @route GET users committees
// @description Get all committees that user is member of
// @access Private
userRouter.get('/committees', authorization, getUserCommittees)

// @route GET users profile
// @description Get profile of user
// @access Private
userRouter.get('/profile', authorization, getUserProfile)

export default userRouter
