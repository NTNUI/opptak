import { application, NextFunction, Request, Response } from 'express'
import { CustomError, UnauthorizedUserError } from 'ntnui-tools/customError'
import { RequestWithNtnuiNo } from '../utils/request'
import { ApplicationModel, IApplication } from '../models/Application'
import { UserModel } from '../models/User'
import { CommitteeModel, ICommittee } from '../models/Committee'
import isAdmissionPeriodActive from '../utils/isApplicationPeriodActive'
import { StatusTypes } from '../utils/enums'
import { IStatus, StatusModel } from '../models/Status'
import { ELECTION_COMMITTEE_ID, MAIN_BOARD_ID } from '../utils/constants'

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
			return res.status(403).json({ message: 'The user is not member of any committee' })
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

		if (userCommitteeIds.includes(ELECTION_COMMITTEE_ID)) {
			return res.status(200).json({ application })
		}

		const applicationCommittees: ICommittee[] = application.committees
		if (userCommitteeIds.includes(MAIN_BOARD_ID)) {
			for (let i = 0; i < applicationCommittees.length; i++) {
				if (applicationCommittees[i]._id === MAIN_BOARD_ID) {
					applicationCommittees.splice(i, 1)
					break;
				}
			}

			// If the applications was only sent to the main board, then the
			// committee array is now empty, since a board member is not 
			// allowed to see applications to the main board
			if (applicationCommittees.length > 0) {
				return res.status(200).json({ application })
			}
			return res.status(403).json({ message: 'Not authorized' })
		}

		// If user is not in election committee or the main board,
		// the code under will be runned, cause the user then is a
		// member of an other committee

		let authorized = false
		// Check if user is in committee that application is sent to
		for (let id = 0; id < applicationCommittees.length; id++) {
			const appCommitteeId = applicationCommittees[id]._id
			if (userCommitteeIds.includes(appCommitteeId)) {
				authorized = true
			}
			else if (appCommitteeId === MAIN_BOARD_ID) {
				applicationCommittees.splice(id, 1)
				id--
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
		var committeeIds: number[] = await getUserCommitteeIdsByUserId(ntnuiNo)

		if (!committeeIds) {
			return res.status(403).json({ message: 'The user is not member of any committee' })
		}

		// Pagination
		var { page } = req.query
		var pageNum = 1 // default value

		// validation of the page-query-parm
		if (undefined != page) {
			pageNum = Number(page)

			if (pageNum < 1 || Number.isNaN(pageNum)) {
				pageNum = 1
			}
		}
		const LIMIT = 4
		var startIndex = (pageNum - 1) * LIMIT

		let total: number
		let applications: IApplication[] = []
		let filter
		let applicationCommitte: { _id: Number, name: string }

		// If user is member of election committe, retrieve all applications
		if (committeeIds.includes(ELECTION_COMMITTEE_ID)) {
			filter = {}

		} else if (committeeIds.includes(MAIN_BOARD_ID)) {
			filter = { committees: { $ne: [MAIN_BOARD_ID] } }

		} else {
			// Retrieve applications that only have the given committees
			filter = { committees: { $in: committeeIds } }
		}

		total = await ApplicationModel.countDocuments(filter)

		await ApplicationModel.find(filter)
			.populate('committees', 'name')
			.select('-statuses')
			.select('name committees submitted_date')
			.limit(LIMIT)
			.skip(startIndex)
			.then((applicationRes) => {
				applications = applicationRes
			})

		// Filter out the main_board_id from committees in applications
		// if not member of the election committee
		if (!committeeIds.includes(ELECTION_COMMITTEE_ID)) {

			// Filter out the main_board_id from committees in applications
			for (let i = 0; i < applications.length; i++) {

				for (let j = 0; j < applications[i].committees.length; j++) {
					// Based on how the Object.values work, to access the values in the object
					// we have to get element 2 in the object
					applicationCommitte = Object.values(applications[i].committees[j])[2]

					if (applicationCommitte._id === MAIN_BOARD_ID) {
						applications[i].committees.splice(j, 1)
						j--
					}
				}
			}
		}

		return res.status(200).json({
			applications,
			currentPage: Number(page),
			numberOfPages: Math.ceil(total / LIMIT),
		})
	} catch (error) {
		console.log(error)
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

export { getApplications, postApplication, getApplicationById }
