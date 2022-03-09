import { Request, Response } from 'express'
import { ApplicationModel } from '../models/Application'

const getApplications = async (req: Request, res: Response) => {
	const { page } = req.query
	const LIMIT = 4
	const startIndex = (Number(page) - 1) * LIMIT
	const total = await ApplicationModel.countDocuments({})

	ApplicationModel.find()
		.populate('committees', 'name')
		.limit(LIMIT)
		.skip(startIndex)
		.then((applications) =>
			res.json({
				applications,
				currentPage: Number(page),
				numberOfPages: Math.ceil(total / LIMIT),
			})
		)
		.catch((err) => res.status(404).json({ message: err.message }))
}

const postApplication = (req: Request, res: Response) => {
	const application = new ApplicationModel(req.body)
	application
		.save()
		.then((newApplication) =>
			res.status(200).json({ application: newApplication })
		)
		.catch((err) => res.status(400).json({ message: err.message }))
}

export { getApplications, postApplication }
