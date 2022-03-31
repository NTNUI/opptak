import { Request, Response } from 'express'
import { UnauthorizedUserError } from 'ntnui-tools/customError'
import { AdmissionPeriodModel } from '../models/AdmissionPeriod'
import { getUserCommitteeIdsByUserId } from '../utils/userCommittee'
import { RequestWithNtnuiNo } from '../utils/request'
import MAIN_BOARD_ID from '../utils/constants'
import isAdmissionPeriodActive from '../utils/isApplicationPeriodActive'

function isValidDate(value: any) {
	const regexDate = /^\d{4}-\d{2}-\d{2}$/
	if (!regexDate.test(value)) {
		return false
	}
	return true
}

const getAdmissionPeriod = async (req: Request, res: Response) => {
	// Only one admission period in the db at any time, so findOne() returns only the one object
	const admissionPeriod = await AdmissionPeriodModel.findOne()
	if (admissionPeriod) {
		return res.status(200).json({ admissionPeriod })
	}

	return res
		.status(404)
		.json({ message: 'There is no admission period in the db' })
}

const putAdmissionPeriod = async (req: RequestWithNtnuiNo, res: Response) => {
	const { ntnuiNo } = req
	if (!ntnuiNo) throw UnauthorizedUserError
	const committeeIds: number[] = await getUserCommitteeIdsByUserId(ntnuiNo)

	if (!(isValidDate(req.body.start_date) && isValidDate(req.body.end_date))) {
		return res.status(500).json({ message: 'The dates are invalid' })
	}

	if (req.body.start_date > req.body.end_date) {
		return res
			.status(500)
			.json({ message: "The start date can't be after the end date" })
	}

	if (committeeIds.includes(MAIN_BOARD_ID)) {
		const update = {
			start_date: req.body.start_date,
			end_date: req.body.end_date,
		}

		// Update the existing admission period or create a new one if it doesn't exist
		if (
			await AdmissionPeriodModel.findOneAndUpdate({}, update, {
				new: true,
				upsert: true,
			})
		) {
			return res.status(200).json({ message: 'Admission period updated' })
		}
		return res
			.status(500)
			.json({ message: 'Something went wrong updating the admission period' })
	}
	return res.status(403).json({ message: 'Not authorized' })
}

const getAdmissionPeriodStatus = async (req: Request, res: Response) => {
	try {
		if (await isAdmissionPeriodActive()) {
			return res.status(200).json({ response: true })
		}
		return res.status(200).json({ response: false })
	} catch (error) {
		return res.status(500).json({ message: error })
	}
}

export { getAdmissionPeriod, putAdmissionPeriod, getAdmissionPeriodStatus }
