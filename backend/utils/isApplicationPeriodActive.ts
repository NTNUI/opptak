import { CustomError } from 'ntnui-tools/customError'
import { ApplicationPeriodModel } from '../models/ApplicationPeriod'

const isApplicationPeriodActive = async () => {
	const applicationPeriod = await ApplicationPeriodModel.findOne()
	if (applicationPeriod) {
		if (
			applicationPeriod.start_date.getTime() <= Date.now() &&
			applicationPeriod.end_date.getTime() + 86400000 > Date.now()
		) {
			return true
		}
		return false
	}
	throw new CustomError('No application period exists', 404)
}

export default isApplicationPeriodActive
