import { Request, Response } from 'express'
import { UserModel } from '../models/User'

async function getMyCommittees() {
	return UserModel.find()
		.then(() => committees)
		.catch(() => {
			throw new CustomError(
				'Could not retrieve committees from local database',
				500
			)
		})
}
