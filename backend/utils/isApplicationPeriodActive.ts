import { CustomError } from 'ntnui-tools/customError'
import add from 'date-fns/add'
import { AdmissionPeriodModel } from '../models/AdmissionPeriod'

const isAdmissionPeriodActive = async () => {
	const admissionPeriod = await AdmissionPeriodModel.findOne()
	if (admissionPeriod) {
		if (
			new Date(admissionPeriod.start_date_string).getTime() <= Date.now() &&
			// Creating a date of end date + 1 day
			add(new Date(admissionPeriod.end_date_string), { days: 1 }).getTime() >
				Date.now()
		) {
			return true
		}
		return false
	}
	throw new CustomError('No admission period exists', 404)
}

export default isAdmissionPeriodActive
