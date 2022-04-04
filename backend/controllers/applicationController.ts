import { NextFunction, Request, Response } from 'express'
import { CustomError, UnauthorizedUserError } from 'ntnui-tools/customError'
import { RequestWithNtnuiNo } from '../utils/request'
import { ApplicationModel, IApplication } from '../models/Application'
import { UserModel } from '../models/User'
import { CommitteeModel, ICommittee } from '../models/Committee'
import isAdmissionPeriodActive from '../utils/isApplicationPeriodActive'
import { StatusTypes } from '../utils/enums'
import { IStatus, StatusModel } from '../models/Status'
import { ELECTION_COMMITTEE_ID, MAIN_BOARD_ID } from '../utils/constants'
import { AdmissionPeriodModel } from '../models/AdmissionPeriod'

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

interface IPopulatedApplicationCommittees
	extends Omit<IApplication, 'committees'> {
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

		if (!userCommitteeIds) {
			return res
				.status(403)
				.json({ message: 'The user is not member of any committee' })
		}

		// Retrieve application and committees the application is sent to
		const application = await ApplicationModel.findById(req.params.application_id)
			.populate<IPopulatedApplicationCommittees>('committees', 'name slug')
			.populate({
				path: 'statuses',
				populate: { path: 'committee', model: 'Committee', select: 'name' },
				select: '-__v',
			})
			.then((applicationRes) => applicationRes)
			.catch(() => {
				throw new CustomError('Could not find application', 404)
			})
		if (!application) throw new CustomError('Could not find application', 404)

		// Election committee are allowed to see all applied committees
		if (userCommitteeIds.includes(ELECTION_COMMITTEE_ID)) {
			return res.status(200).json({ application })
		}

		const applicationCommittees: ICommittee[] = application.committees
		// Main board are allowed to see all applied committees,
		// but not to the main board
		if (userCommitteeIds.includes(MAIN_BOARD_ID)) {
			for (let i = 0; i < applicationCommittees.length; i += 1) {
				if (applicationCommittees[i]._id === MAIN_BOARD_ID) {
					applicationCommittees.splice(i, 1)
					application.statuses.splice(i, 1)
					break
				}
			}

			if (applicationCommittees.length > 0) {
				return res.status(200).json({ application })
			}
			return res.status(403).json({ message: 'Not authorized' })
		}

		let authorized = false
		for (let id = 0; id < applicationCommittees.length; id += 1) {
			const appCommitteeId = applicationCommittees[id]._id
			if (userCommitteeIds.includes(appCommitteeId)) {
				authorized = true
			} else if (appCommitteeId === MAIN_BOARD_ID) {
				applicationCommittees.splice(id, 1)
				application.statuses.splice(id, 1)
				id -= 1
			}
		}
		if (authorized === true) {
			return res.status(200).json({ application })
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

		if (!committeeIds) {
			return res
				.status(403)
				.json({ message: 'The user is not member of any committee' })
		}

		// Pagination
		const { page, name } = req.query
		const LIMIT = 4
		const startIndex = (page - 1) * LIMIT

		let filter

		if (committeeIds.includes(ELECTION_COMMITTEE_ID)) {
			// Election committee are allowed to see all applications
			filter = {}
		} else if (committeeIds.includes(MAIN_BOARD_ID)) {
			// Main board are allowed to see all applications except
			// to the main board
			filter = { committees: { $ne: [MAIN_BOARD_ID] } }
		} else {
			// All other committees are only allowed to se applications
			// to their own committee
			filter = { committees: { $in: committeeIds } }
		}

		const total = await ApplicationModel.countDocuments(filter)

		const applications = await ApplicationModel.find(filter)
			.populate<IPopulatedApplicationCommittees>('committees', 'name')
			.select('name committees submitted_date')
			.limit(LIMIT)
			.skip(startIndex)
			.then((applicationRes) => applicationRes)

		if (!committeeIds.includes(ELECTION_COMMITTEE_ID)) {
			for (let i = 0; i < applications.length; i += 1) {
				for (let j = 0; j < applications[i].committees.length; j += 1) {
					if (applications[i].committees[j]._id === MAIN_BOARD_ID) {
						applications[i].committees.splice(j, 1)
						j -= 1
					}
				}
			}
		}

		// Filter applications by name
		const nameString = name as string
		if (nameString) {
			applications = applications.filter((application) => application.name.toLowerCase().includes(nameString.toLowerCase()))
		}

		// Filter applications by committee
		const { committee } = req.query
		if (committee) {
			const committeeId = Number(committee)
			applications = applications.filter((application) => application.committees.some((committee) => committee === committeeId))
		}

		return res.status(200).json({
			applications,
			currentPage: Number(pageNum),
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
		// Check that all applied committees accepts admissions
		const closedCommittees = await CommitteeModel.findOne({
			_id: { $in: req.body.committees },
			accepts_admissions: false,
		})
		if (closedCommittees) {
			return res
				.status(400)
				.json({ message: 'A committee the application was sent to is closed' })
		}
		// Create a status model for each committee the application is sent to
		const statuses = req.body.committees.map((committee: number) => ({
			committee,
			status: StatusTypes.PENDING,
		}))
		// Insert statuses in database
		const insertedStatuses = await StatusModel.insertMany(statuses, {
			ordered: true,
		})
			.then((statusRes) => statusRes)
			.catch(() => {
				throw new CustomError('Something went wrong creating statuses', 500)
			})
		const statusIds = insertedStatuses.map((stat: IStatus) => stat)
		// Create application
		const application = new ApplicationModel({ ...req.body, statuses: statusIds })
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

const wipeAdmissionData = async (
	req: RequestWithNtnuiNo,
	res: Response,
	next: NextFunction
) => {
	try {
		const { ntnuiNo } = req
		if (!ntnuiNo) throw UnauthorizedUserError
		const committeeIds: number[] = await getUserCommitteeIdsByUserId(ntnuiNo)
		// Only main board can delete all applications
		if (!committeeIds.includes(MAIN_BOARD_ID)) {
			throw new CustomError('You do not have access to this resource', 403)
		}
		await ApplicationModel.deleteMany({})
		await StatusModel.deleteMany({})
		await UserModel.deleteMany({ _id: { $ne: ntnuiNo } })
		await AdmissionPeriodModel.deleteMany({})
		await CommitteeModel.updateMany({}, { accepts_admissions: false })
		return res.status(200).json({ message: 'Admission data successfully wiped' })
	} catch (error) {
		return next(error)
	}
}

export {
	getApplications,
	postApplication,
	getApplicationById,
	wipeAdmissionData,
}
