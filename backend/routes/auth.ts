import express from 'express'
import login, { verify } from '../controllers/authController'

const authRouter = express.Router()

// @route GET committees
// @description Get all committees
// @access Public
authRouter.post('/', login)

authRouter.post('/verify', verify)

export default authRouter
