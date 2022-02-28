import express from 'express'
import cors from 'cors'
import connectDB from './config/db'
import testRoute from './routes/test'
import committeeRouter from './routes/committees'
import applicationRouter from './routes/applications'

const app = express()
// Connect Database
connectDB()

// Set up middleware
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Set up routes
app.use('/test', testRoute)
app.use('/applications', applicationRouter)
app.use('/committees', committeeRouter)

const port = 8082

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server running on port ${port}`))
