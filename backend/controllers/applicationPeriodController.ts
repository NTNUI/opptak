import { Request, Response } from 'express'
import { UnauthorizedUserError } from 'ntnui-tools/customError'
import { ApplicationPeriodModel } from '../models/ApplicationPeriod'
import getUserCommitteeIdsByUserId from '../utils/userCommittee'
import applicationPeriodStatus from '../utils/periodForApplication'
import { RequestWithNtnuiNo } from '../utils/request'

const getApplicationPeriod = async (req: Request, res: Response) => {
	// Only one application period in the db at any time, so findOne() returns only the one object
	const applicationPeriod = await ApplicationPeriodModel.findOne()
	if (applicationPeriod !== null) {
		return res.status(200).json({ applicationPeriod })
	}
	return res
		.status(200)
		.json({ message: 'There is no application period in the db' })
}

const putApplicationPeriod = async (req: RequestWithNtnuiNo, res: Response) => {
	const mainBoardID = 9

	const { ntnuiNo } = req
	if (!ntnuiNo) throw UnauthorizedUserError
	const committeeIds: number[] = await getUserCommitteeIdsByUserId(ntnuiNo)

	if (committeeIds.find((id) => id === mainBoardID)) {
		const update = {
			start_date: req.body.start_date,
			end_date: req.body.end_date,
		}

		// Update the existing application period or create a new one if it doesn't exist
		if (
			await ApplicationPeriodModel.findOneAndUpdate({}, update, {
				new: true,
				upsert: true,
			})
		) {
			return res.status(200).json({ message: 'Application period updated' })
		}
		return res
			.status(500)
			.json({ message: 'Something went wrong updating the application period' })
	}
	return res.status(403).json({ message: 'Not authorized' })
}

const isApplicationPeriodActive = async (req: Request, res: Response) => {
	try {
		if (await applicationPeriodStatus()) {
			return res.status(200).json({ response: true })
		}
		return res.status(200).json({ response: false })
	} catch (error) {
		return res.status(500).json({ message: error })
	}
}

export { getApplicationPeriod, putApplicationPeriod, isApplicationPeriodActive }
