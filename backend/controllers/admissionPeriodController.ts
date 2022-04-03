import { Request, Response } from 'express'
import { UnauthorizedUserError } from 'ntnui-tools/customError'
import isBefore from 'date-fns/isBefore'
import { AdmissionPeriodModel } from '../models/AdmissionPeriod'
import { getUserCommitteeIdsByUserId } from '../utils/userCommittee'
import { RequestWithNtnuiNo } from '../utils/request'
import MAIN_BOARD_ID from '../utils/constants'
import isAdmissionPeriodActive from '../utils/isApplicationPeriodActive'

function validateAndFormatDateString(value: string): string {
	// Typical ISOString, 2022-01-31T00:00:00.000Z, fetching only the 10 first characters
	const dateString = new Date(Date.parse(value)).toISOString().substring(0, 10)
	return dateString
}

const getAdmissionPeriod = async (req: Request, res: Response) => {
	// Only one admission period in the db at any time, so findOne() returns only the one object
	const admissionPeriod = await AdmissionPeriodModel.findOne()

	if (admissionPeriod) {
		const admissionPeriodResponse = {
			start_date: admissionPeriod.start_date_string,
			end_date: admissionPeriod.end_date_string,
		}
		return res.status(200).json({ admissionPeriodResponse })
	}

	return res
		.status(404)
		.json({ message: 'There is no admission period in the db' })
}

const putAdmissionPeriod = async (req: RequestWithNtnuiNo, res: Response) => {
	const { ntnuiNo } = req
	if (!ntnuiNo) throw UnauthorizedUserError
	const committeeIds: number[] = await getUserCommitteeIdsByUserId(ntnuiNo)

	if (committeeIds.includes(MAIN_BOARD_ID)) {
		let update

		try {
			update = {
				start_date_string: validateAndFormatDateString(req.body.start_date),
				end_date_string: validateAndFormatDateString(req.body.end_date),
			}
		} catch (error) {
			return res.status(400).json({ message: 'The dates are invalid' })
		}

		if (
			!isBefore(
				Date.parse(update.start_date_string),
				Date.parse(update.end_date_string)
			)
		) {
			return res
				.status(400)
				.json({ message: "The start date can't be the same or after the end date" })
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
