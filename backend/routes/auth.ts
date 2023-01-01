import express from 'express'
import { login, logout, refresh, verify } from 'controllers/authController'

const authRouter = express.Router()

// @route POST /auth
// @description Post phone_number and password and retrieve access token and refresh token
// @access Public
authRouter.post('/', login)

// @route POST /auth/logout
// @description Invalidates cookies
// @access Public
authRouter.post('/logout', logout)

// @route POST /auth/verify
// @description Post token to verify validity
// @access Public
authRouter.post('/verify', verify)

// @route POST /auth/refresh
// @description Post refresh-token to retrieve new access token and refresh token
// @access Public
authRouter.post('/refresh', refresh)

export default authRouter
