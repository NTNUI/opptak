import { NextFunction, Request, Response } from 'express'
import { CustomError, UnauthorizedUserError } from 'ntnui-tools/customError'
import { RequestWithNtnuiNo } from '../utils/request'
import { ApplicationModel, IApplication } from '../models/Application'
import { UserModel } from '../models/User'
import { CommitteeModel, ICommittee } from '../models/Committee'
import isAdmissionPeriodActive from '../utils/isApplicationPeriodActive'

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

interface IPopulatedApplication extends Omit<IApplication, 'committees'> {
	committees: ICommittee[]
}

const getApplicationById = async (
	req: RequestWithNtnuiNo,
	res: Response,
	next: NextFunction
) => {
	try {
		// Access control - retrieve committees that user is member of
		const { ntnuiNo } = req
		if (!ntnuiNo) throw UnauthorizedUserError
		const userCommitteeIds: number[] = await getUserCommitteeIdsByUserId(ntnuiNo)
		// Retrieve application and committees the application is sent to
		const application = await ApplicationModel.findById(req.params.application_id)
			.populate<IPopulatedApplication>('committees', 'name slug')
			.then((applicationRes) => applicationRes)
			.catch(() => {
				throw new CustomError('Could not find application', 404)
			})
		if (!application) throw new CustomError('Could not find application', 404)
		const applicationCommittees: ICommittee[] = application.committees
		// Check if user is in committee that application is sent to
		for (let id = 0; id < applicationCommittees.length; id += 1) {
			const appCommitteeId = applicationCommittees[id]._id
			if (userCommitteeIds.includes(appCommitteeId)) {
				return res.status(200).json({ application })
			}
		}
		throw new CustomError('You do not have access to this application', 403)
	} catch (error) {
		return next(error)
	}
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
		if (!(await isAdmissionPeriodActive())) {
			throw new CustomError('Admission period is not active', 403)
		}

		const application = new ApplicationModel(req.body)

		// Check that all applied committees accepts admissions
		const closedCommittees = await CommitteeModel.findOne({
			_id: { $in: application.committees },
			accepts_admissions: false,
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
			.catch((err) => {
				if (err.name === 'ValidationError') {
					return res.status(400).json({ message: err.message })
				}
				return res.status(500).json({ message: 'Unable to save application' })
			})
	} catch (error) {
		return next(error)
	}
}

export { getApplications, postApplication, getApplicationById }
