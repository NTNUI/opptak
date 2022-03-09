import express from 'express'
import { login, refresh, verify } from '../controllers/authController'

const authRouter = express.Router()

// @route POST login endpoint
// @description Post phone_number and password and retrieve access token and refresh token
// @access Public
authRouter.post('/', login)

// @route POST verify token
// @description Post token to verify validity
// @access Public
authRouter.post('/verify', verify)

// @route Post refresh token
// @description Post refresh-token to retrieve new access token and refresh token
// @access Public
authRouter.post('/refresh', refresh)

export default authRouter
