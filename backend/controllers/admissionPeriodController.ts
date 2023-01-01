import { Request, Response } from 'express'
import { UnauthorizedUserError } from 'ntnui-tools/customError'
import dayjs from 'dayjs'
import { AdmissionPeriodModel } from 'models/AdmissionPeriod'
import { RequestWithNtnuiNo } from 'utils/request'
import { MAIN_BOARD_ID } from 'utils/constants'
import getAdmissionPeriodStatus from 'utils/getAdmissionPeriodStatus'
import { UserModel } from 'models/User'

function validateAndFormatDateString(value: string): string {
	// Expect ISO-string (YYYY-MM-DDTHH:mm:ss.sssZ)
	const dateString = dayjs(Date.parse(value)).format('YYYY-MM-DD')

	if (dateString === 'Invalid Date') {
		throw Error(dateString)
	}

	return dateString
}

const getAdmissionPeriod = async (req: Request, res: Response) => {
	// Only one admission period in the db at any time, so findOne() returns only the one object
	const admissionPeriod = await AdmissionPeriodModel.findOne()

	if (!admissionPeriod) {
		return res
			.status(404)
			.json({ message: 'There is no admission period in the db' })
	}
	return res
		.status(200)
		.json({ admissionPeriod, admissionStatus: await getAdmissionPeriodStatus() })
}

const putAdmissionPeriod = async (req: RequestWithNtnuiNo, res: Response) => {
	const { ntnuiNo } = req
	if (!ntnuiNo) throw UnauthorizedUserError
	const user = await UserModel.findById(ntnuiNo)
	if (!user) throw UnauthorizedUserError
	if (
		user.committees.some(
			(roleInCommittee) => roleInCommittee.committee === MAIN_BOARD_ID
		)
	) {
		let update

		try {
			update = {
				start_date: validateAndFormatDateString(req.body.start_date),
				end_date: validateAndFormatDateString(req.body.end_date),
				set_by: `${user.first_name} ${user.last_name}`,
			}
		} catch (error) {
			return res.status(400).json({ message: 'The dates are invalid' })
		}

		if (!dayjs(update.start_date).isBefore(dayjs(update.end_date))) {
			return res
				.status(400)
				.json({ message: "The start date can't be the same or after the end date" })
		}

		// Update the existing admission period or create a new one if it doesn't exist
		return AdmissionPeriodModel.findOneAndUpdate({}, update, {
			new: true,
			upsert: true,
		})
			.then((updatedAdmission) =>
				res.status(200).json({ admissionPeriod: updatedAdmission })
			)
			.catch(() =>
				res
					.status(500)
					.json({ message: 'Something went wrong updating the admission period' })
			)
	}
	return res.status(403).json({ message: 'Not authorized' })
}

export { getAdmissionPeriod, putAdmissionPeriod }
