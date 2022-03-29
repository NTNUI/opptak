import { CustomError } from 'ntnui-tools/customError'
import { IRoleInCommittee, UserModel } from '../models/User'

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

async function getUserRoleInCommitteeByUserId(userId: number | string) {
	let rolesInCommittees: IRoleInCommittee[] = []
	await UserModel.findById(userId)
		.then((user) => {
			if (user) {
				rolesInCommittees = user.committees
			}
		})
		.catch(() => {
			throw new CustomError('Something went wrong when trying to find user', 500)
		})
	return rolesInCommittees
}

export { getUserCommitteeIdsByUserId, getUserRoleInCommitteeByUserId }
