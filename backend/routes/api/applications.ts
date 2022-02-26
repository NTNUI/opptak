import express from 'express'
import { ApplicationModel } from '../../models/Application'

const applicationRouter = express.Router()

// @route GET applications
// @description Get all applications
// @access Public
applicationRouter.get('/', async (_req, res) => {
	ApplicationModel.find()
		.populate('committees', 'name')
		.then((applications) =>
			res.json({
				applications,
			})
		)
		.catch((err) => res.status(404).json({ error: err }))
})

// @route POST applications
// @description Add application
// @access Public
applicationRouter.post('/', (req, res) => {
	const application = new ApplicationModel(req.body)
	application
		.save()
		.then((newApplication) =>
			res.status(200).json({ application: newApplication })
		)
		.catch((err) => res.status(400).json({ error: err }))
})

export default applicationRouter
