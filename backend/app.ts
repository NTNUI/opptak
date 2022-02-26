import express from 'express'
import cors from 'cors'
import connectDB from './config/db'
// routes
import testRoute from './routes/api/test'
import committeeRouter from './routes/api/committees'
import applicationRouter from './routes/api/applications'

const app = express()
connectDB()

// Use cors
app.use(cors({ origin: 'http://localhost:3000' }))
// Connect Database
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/test', testRoute)
app.use('/applications', applicationRouter)
app.use('/committees', committeeRouter)

const port = 8082

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server running on port ${port}`))
