import { Request, Response } from 'express'
import { ApplicationModel } from '../models/Application'

const getApplications = (_req: Request, res: Response) => {
	ApplicationModel.find()
		.populate('committees', 'name')
		.then((applications) =>
			res.json({
				applications,
			})
		)
		.catch((err) => res.status(404).json({ error: err.message }))
}

const postApplication = (req: Request, res: Response) => {
	const application = new ApplicationModel(req.body)
	application
		.save()
		.then((newApplication) =>
			res.status(200).json({ application: newApplication })
		)
		.catch((err) => res.status(400).json({ error: err.message }))
}

export { getApplications, postApplication }
