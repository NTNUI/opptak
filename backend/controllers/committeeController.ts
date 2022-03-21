import { Request, Response } from 'express'
import { CommitteeModel } from '../models/Committee'

const getCommittees = (_req: Request, res: Response) => {
	CommitteeModel.find()
		.then((committees) => res.json(committees))
		.catch((err) => res.status(404).json({ message: err.message }))
}

async function acceptApplicants(req: Request, res: Response) {
	// TODO: Implement check if user is organizer or leader of committee
	const { slug } = req.params
	const committee = await CommitteeModel.findOne({ slug })
	if (!committee) {
		return res.status(404).json({ message: 'Committee not found' })
	}
	committee.accepts_applicants = !committee.accepts_applicants
	const applicationStatus = committee.accepts_applicants ? 'opened' : 'closed'

	return committee
		.save()
		.then(() =>
			res.status(200).json({
				message: `Committee ${committee.name} ${applicationStatus} for applications`,
			})
		)
		.catch((err) => res.status(500).json({ message: err.message }))
}

export { getCommittees, acceptApplicants }
