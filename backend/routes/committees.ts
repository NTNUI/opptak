import express from 'express'
import getCommittees from '../controllers/committeeController'

const committeeRouter = express.Router()

// @route GET committees
// @description Get all committees
// @access Public
committeeRouter.get('/', getCommittees)

export default committeeRouter
