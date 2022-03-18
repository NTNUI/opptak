import { NextFunction, Request, Response } from 'express'
import { CustomError, UnauthorizedUserError } from 'ntnui-tools/customError'
import { RequestWithNtnuiNo } from '../utils/request'
import { ApplicationModel } from '../models/Application'
import { UserModel } from '../models/User'

// TODO: Move function?
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
		}) // TODO: Correct error handling
	return committeeIds
}

const getApplications = async (
	req: RequestWithNtnuiNo,
	res: Response,
	next: NextFunction
) => {
	try {
		// Access control - retrieve committees that user is member of
		const { ntnuiNo } = req
		if (!ntnuiNo) throw UnauthorizedUserError
		const committeeIds: number[] = await getUserCommitteeIdsByUserId(ntnuiNo)
		// Pagination
		const { page } = req.query
		const LIMIT = 4
		const startIndex = (Number(page) - 1) * LIMIT
		const total = await ApplicationModel.countDocuments({
			committees: { $in: committeeIds },
		})
		// Retrieve applications that only have the given committees
		await ApplicationModel.find({ committees: { $in: committeeIds } })
			.populate('committees', 'name')
			.limit(LIMIT)
			.skip(startIndex)
			.then((applications) =>
				res.status(200).json({
					applications,
					currentPage: Number(page),
					numberOfPages: Math.ceil(total / LIMIT),
				})
			)
			.catch(() => {
				throw new CustomError('Unable to retrieve applications', 500)
			})
	} catch (error) {
		return next(error)
	}
	throw new CustomError('Unable to retrieve applications', 500)
}

const postApplication = (req: Request, res: Response) => {
	const application = new ApplicationModel(req.body)
	application
		.save()
		.then((newApplication) =>
			res.status(200).json({ application: newApplication })
		)
		.catch((err) => res.status(400).json({ message: err.message }))
}

export { getApplications, postApplication }
