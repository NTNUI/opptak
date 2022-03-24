import { CustomError } from 'ntnui-tools/customError'
import { UserModel } from '../models/User'

async function getUserCommitteeIdsByUserId(userId: number | string) {
	let committeeIds: number[] = []
	await UserModel.findById(userId)
		.then((user) => {
			if (user) {
				committeeIds = user.committees.map((committee) => committee.committee)
			}
		})
		.catch(() => {
			throw new CustomError('Something went wrong when trying to find user', 500)
		})
	return committeeIds
}

export default getUserCommitteeIdsByUserId
