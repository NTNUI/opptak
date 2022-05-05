import { CustomError } from 'ntnui-tools/customError'
import dayjs from 'dayjs'
import { AdmissionPeriodModel } from '../models/AdmissionPeriod'
import { AdmissionPeriodStatus } from "./enums"

const getAdmissionPeriodStatus = async () => {
	const admissionPeriod = await AdmissionPeriodModel.findOne()
	if (!admissionPeriod) {
		throw new CustomError('No admission period exists', 404)
	}
	const today = Date.now()
	if (dayjs(admissionPeriod.end_date).add(1, 'day').isBefore(today)) {
		return AdmissionPeriodStatus.finished
	}
	if (dayjs(admissionPeriod.start_date).isAfter(today)) {
		return AdmissionPeriodStatus.upcoming
	}
	return AdmissionPeriodStatus.open
}

export default getAdmissionPeriodStatus
