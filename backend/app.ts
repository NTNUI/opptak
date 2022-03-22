import express from 'express'
import cors from 'cors'
import axios from 'axios'
import cookieParser = require('cookie-parser')
import connectDB from './config/db'
import testRoute from './routes/test'
import committeeRouter from './routes/committees'
import applicationRouter from './routes/applications'
import authRouter from './routes/auth'
import userRouter from './routes/user'
import errorHandler from './utils/errorHandler'

axios.defaults.baseURL = 'https://dev.api.ntnui.no/' // GET FROM ENV OR CONFIG
const app = express()
// Connect Database
connectDB()

// Set up middleware
app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Set up routes
app.use('/auth', authRouter)
app.use('/test', testRoute)
app.use('/applications', applicationRouter)
app.use('/committees', committeeRouter)
app.use('/user', userRouter)

// Error handling middleware
app.use(errorHandler)

const port = 8082

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server running on port ${port}`))
