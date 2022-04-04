import { CustomError } from 'ntnui-tools/customError'
import dayjs from 'dayjs'
import { AdmissionPeriodModel } from '../models/AdmissionPeriod'

const isAdmissionPeriodActive = async () => {
	const admissionPeriod = await AdmissionPeriodModel.findOne()
	if (admissionPeriod) {
		if (
			(
				(dayjs(admissionPeriod.start_date).isBefore(dayjs(Date.now()))) ||
				(dayjs(admissionPeriod.start_date).isSame(dayjs(Date.now())))
			)
			&&
			// Creating a date of end date + 1 day
			dayjs(admissionPeriod.end_date).add(1, 'day').isAfter(dayjs(Date.now()))
		) {
			return true
		}
		return false
	}
	throw new CustomError('No admission period exists', 404)
}

export default isAdmissionPeriodActive
