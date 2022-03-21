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
		const user = await UserModel.findOne({ ntnuiNo }).populate(
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

export default getUserCommittees
