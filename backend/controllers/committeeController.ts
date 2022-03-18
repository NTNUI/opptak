import { Request, Response } from 'express'
import { CommitteeModel } from '../models/Committee'

const getCommittees = (_req: Request, res: Response) => {
	CommitteeModel.find()
		.then((committees) => res.json(committees))
		.catch((err) => res.status(404).json({ message: err.message }))
}

const postOpenForApplications = (req: Request, res: Response) => {
	CommitteeModel.find({ slug: req.params.slug, accepts_applicants: Boolean })
		.then((committees) => {
			if (committees.length === 0) {
				return res.status(404).json({ message: 'Committee not found' })
			}

			const committee = committees[0]
			committee.accepts_applicants = true
			committee
				.save()
				.then((committee) => res.status(200).json(committee))
				.catch((err) => res.status(400).json({ message: err.message }))
		}
		)
}

export default getCommittees
