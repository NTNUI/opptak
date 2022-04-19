import { NextFunction, Response } from 'express'
import { CustomError, UnauthorizedUserError } from 'ntnui-tools/customError'
import { RequestWithNtnuiNo } from '../utils/request'
import { IUser, UserModel } from '../models/User'
import { StatusModel } from '../models/Status'

const putStatus = async (
	req: RequestWithNtnuiNo,
	res: Response,
	next: NextFunction
) => {
	try {
		// Access control - retrieve user
		const { ntnuiNo } = req
		if (!ntnuiNo) throw UnauthorizedUserError
		const user: IUser | null = await UserModel.findById(ntnuiNo)
			.then((userRes) => userRes)
			.catch(() => {
				throw new CustomError('Something went wrong while retrieving the user', 500)
			})
		if (!user) throw new CustomError('Could not find user', 404)
		// Retrieve status
		const status = await StatusModel.findById(req.params.statusId)
			.then((statusRes) => statusRes)
			.catch(() => {
				throw new CustomError(
					'Something went wrong while retrieving the status',
					500
				)
			})
		if (!status) throw new CustomError('Could not find status', 404)
		// Check that user is in committee that status is set for
		const isUserInCommittee = user.committees.find(
			(committee) => committee.committee === status.committee
		)
		if (!isUserInCommittee) {
			throw new CustomError(
				'You do not have access to change the status of this application for this committee',
				403
			)
		}
		status.value = req.body.value
		status.set_by = `${user.first_name} ${user.last_name}`
		// Save status
		return status
			.save()
			.then((newStatus) =>
				res.status(200).json({
					status: newStatus,
				})
			)
			.catch((err) => {
				if (err.name === 'ValidationError') {
					return res.status(400).json({ message: err.message })
				}
				throw new CustomError('Could not update status', 500)
			})
	} catch (error) {
		return next(error)
	}
}

export default putStatus
