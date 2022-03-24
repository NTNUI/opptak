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

	throw new CustomError(
		'Something went wrong when trying to find the application period status',
		500
	)
}

export default isApplicationPeriodActive
