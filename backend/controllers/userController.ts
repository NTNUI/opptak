import { NextFunction, Response } from 'express'
import { UnauthorizedUserError } from 'ntnui-tools/customError'
import { RequestWithNtnuiNo } from '../utils/request'
import { UserModel } from '../models/User'

const getUserCommittees = async (
	req: RequestWithNtnuiNo,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ntnuiNo } = req
		if (!ntnuiNo) throw UnauthorizedUserError
		const user = await UserModel.findOne({ _id: ntnuiNo }).populate(
			'committees.committee'
		)
		if (!user) throw UnauthorizedUserError
		const { committees } = user
		return res.status(200).json({
			committees,
		})
	} catch (error) {
		return next(error)
	}
}

const getUserProfile = async (
	req: RequestWithNtnuiNo,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ntnuiNo } = req
		if (!ntnuiNo) throw UnauthorizedUserError
		const user = await UserModel.findOne({ _id: ntnuiNo }).populate(
			'committees.committee',
			'name slug'
		)
		if (!user) throw UnauthorizedUserError
		return res.status(200).json({
			first_name: user.first_name,
			last_name: user.last_name,
			committees: user.committees,
		})
	} catch (error) {
		return next(error)
	}
}

export { getUserCommittees, getUserProfile }
