import { CustomError } from 'ntnui-tools/dist/customError'
import dayjs from 'dayjs'
import { AdmissionPeriodModel } from '../models/AdmissionPeriod'

const isAdmissionPeriodActive = async () => {
	const admissionPeriod = await AdmissionPeriodModel.findOne()
	if (admissionPeriod) {
		if (
			// Subtracting 1 millisecond, to make sure the time 00:00:00.000 is also active a part of the
			// active period
			dayjs(admissionPeriod.start_date)
				.subtract(1, 'millisecond')
				.isBefore(dayjs(Date.now())) &&
			// Adding 1 day and then subtracting 1 millisecond to the end date, to make the active period
			// to last to 23:59:59.999
			dayjs(admissionPeriod.end_date)
				.add(1, 'day')
				.subtract(1, 'millisecond')
				.isAfter(dayjs(Date.now()))
		) {
			return true
		}
		return false
	}
	throw new CustomError('No admission period exists', 404)
}

export default isAdmissionPeriodActive
