import { NextFunction, Request, Response } from 'express'
import { CustomError, UnauthorizedUserError } from 'ntnui-tools/customError'
import { RequestWithNtnuiNo } from '../utils/request'
import { ApplicationModel } from '../models/Application'
import { UserModel } from '../models/User'

const getApplications = async (
	req: RequestWithNtnuiNo,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ntnuiNo } = req
		// Access control - retrieve committees that user is member of
		if (!ntnuiNo) throw UnauthorizedUserError
		let committeeIds: number[] = []
		await UserModel.findById(ntnuiNo)
			.then((user) => {
				if (user) {
					committeeIds = user.committees.map((committee) => committee.committee)
				}
			})
			// eslint-disable-next-line arrow-body-style
			.catch(() => {
				return res.status(401).json({message: 'Unauthorized user!'})
			}) // TODO: Correct error handling

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
			.catch((err) => {
				console.log(err)
				res.status(401).json({message: 'Could not find any committees'})
			})
	} catch (error) {
		return next(error)
	}
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
