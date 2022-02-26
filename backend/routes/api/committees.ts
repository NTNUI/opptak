import express from 'express'
import { CommitteeModel } from '../../models/Committee'

const committeeRouter = express.Router()

// @route GET committees
// @description Get all committees in the application database
// @access Public
committeeRouter.get('/', (_req, res) => {
	CommitteeModel.find()
		.then((committees) => res.json(committees))
		.catch((err) => res.status(404).json({ error: err.message }))
})

export default committeeRouter
