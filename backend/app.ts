/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import cookieParser = require('cookie-parser')
import dotenv from 'dotenv'
import connectDB from './config/db'
import committeeRouter from './routes/committees'
import applicationRouter from './routes/applications'
import authRouter from './routes/auth'
import userRouter from './routes/user'
import errorHandler from './utils/errorHandler'
import statusRouter from './routes/statuses'

dotenv.config()

axios.defaults.baseURL = process.env.API_URI || 'https://api.ntnui.no'
console.log('📡 API_URI set to', axios.defaults.baseURL)

const app = express()

connectDB()

// Set up middleware
app.use(cookieParser())
app.use(
	cors({
		origin: process.env.FRONTEND_URI || 'https://opptak.ntnui.no',
		credentials: true,
	})
)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Set up routes
app.use('/auth', authRouter)
app.use('/applications', applicationRouter)
app.use('/statuses', statusRouter)
app.use('/committees', committeeRouter)
app.use('/user', userRouter)

// Error handling middleware
app.use(errorHandler)

const port = process.env.PORT || 8082

app.listen(port, () => console.log(`🍑 Express.js app running on port ${port}`))
