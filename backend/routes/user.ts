import express from 'express'
import getUserCommittees from '../controllers/userController'
import authorization from '../utils/authorizationMiddleware'

const userRouter = express.Router()

// @route GET users committees
// @description Get all committees that user is member of
// @access Private
userRouter.get('/committees', authorization, getUserCommittees)

export default userRouter
