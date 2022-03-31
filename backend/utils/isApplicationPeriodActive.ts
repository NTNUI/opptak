import { CustomError } from 'ntnui-tools/customError'
import { AdmissionPeriodModel } from '../models/AdmissionPeriod'

const isAdmissionPeriodActive = async () => {
	const admissionPeriod = await AdmissionPeriodModel.findOne()
	if (admissionPeriod) {
		if (
			admissionPeriod.start_date.getTime() <= Date.now() &&
			admissionPeriod.end_date.getTime() + 86400000 > Date.now()
		) {
			return true
		}
		return false
	}
	throw new CustomError('No admission period exists', 404)
}

export default isAdmissionPeriodActive
