import { NextFunction, Request, Response } from 'express'
import { CustomError, UnauthorizedUserError } from 'ntnui-tools/customError'
import { RequestWithNtnuiNo } from '../utils/request'
import { ApplicationModel, IApplication } from '../models/Application'
import { UserModel } from '../models/User'
import { CommitteeModel } from '../models/Committee'

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
		let applications: IApplication[] = []
		await ApplicationModel.find({
			committees: { $in: committeeIds },
		})
			.populate('committees', 'name')
			.limit(LIMIT)
			.skip(startIndex)
			.then((applicationRes) => {
				applications = applicationRes
			})
			.catch(() => {
				throw new CustomError('Something went wrong retrieving applications', 500)
			})

		return res.status(200).json({
			applications,
			currentPage: Number(page),
			numberOfPages: Math.ceil(total / LIMIT),
		})
	} catch (error) {
		return next(error)
	}
}

const postApplication = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const application = new ApplicationModel(req.body)
		// Check that all applied committees accepts applicants
		const closedCommittees = await CommitteeModel.findOne({
			_id: { $in: application.committees },
			accepts_applicants: false,
		})
		if (closedCommittees) {
			return res
				.status(400)
				.json({ message: 'A committee the application was sent to is closed' })
		}
		return application
			.save()
			.then((newApplication) =>
				res.status(200).json({ application: newApplication })
			)
	} catch (error) {
		return next(error)
	}
}

export { getApplications, postApplication }
