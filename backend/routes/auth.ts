import express from 'express'
import login from '../controllers/authController'

const authRouter = express.Router()

// @route GET committees
// @description Get all committees
// @access Public
authRouter.post('/', login)

export default authRouter
