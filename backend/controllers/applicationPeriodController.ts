import { Request, Response } from 'express'
import { UnauthorizedUserError } from 'ntnui-tools/customError'
import { ApplicationPeriodModel } from '../models/ApplicationPeriod'
import getUserCommitteeIdsByUserId from '../utils/userCommittee'
import { RequestWithNtnuiNo } from '../utils/request'

const getApplicationPeriod = async (req: Request, res: Response) => {
	// Only one application period in the db at any time, so findOne() returns only the one object
	const applicationPeriod = await ApplicationPeriodModel.findOne()

	return res.status(200).json({ applicationPeriod })
}

const postApplicationPeriod = async (req: Request, res: Response) => {
	const applicationPeriod = new ApplicationPeriodModel(req.body)

	applicationPeriod
		.save()
		.then((newApplicationPeriod) =>
			res.status(200).json({ applicationPeriod: newApplicationPeriod })
		)
		.catch((err) => res.status(400).json({ message: err.message }))
}

const putApplicationPeriod = async (req: RequestWithNtnuiNo, res: Response) => {
	const mainBoardID = 9

	const { ntnuiNo } = req
	if (!ntnuiNo) throw UnauthorizedUserError
	const committeeIds: number[] = await getUserCommitteeIdsByUserId(ntnuiNo)

	if (committeeIds.find((id) => id === mainBoardID)) {
		// Only one application period in the db at any time, so findOne() returns only the one object
		const applicationPeriod = await ApplicationPeriodModel.findOne()

		if (!applicationPeriod) {
			return res.status(404).json({ message: 'Application period not found' })
		}

		applicationPeriod.start_date = req.body.start_date
		applicationPeriod.end_date = req.body.end_date

		return applicationPeriod
			.save()
			.then(() => res.status(200).json({ message: 'Application period updated' }))
			.catch((err) => res.status(500).json({ message: err.message }))
	}
	return res.status(403).json({ message: 'Not authorized' })
}

const isApplicationPeriodActive = async (req: Request, res: Response) => {
	const applicationPeriod = await ApplicationPeriodModel.findOne()

	if (applicationPeriod) {
		if (
			applicationPeriod.start_date.getTime() <= Date.now() &&
			applicationPeriod.end_date.getTime() >= Date.now()
		) {
			return res.status(200).json({ response: true })
		}
		return res.status(200).json({ response: false })
	}

	return res
		.status(500)
		.json({ message: 'Error checking application period status' })
}

export {
	getApplicationPeriod,
	postApplicationPeriod,
	putApplicationPeriod,
	isApplicationPeriodActive,
}
