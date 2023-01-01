import { NextFunction, Request, Response } from 'express'
import { CustomError, UnauthorizedUserError } from 'ntnui-tools/customError'
import { CommitteeModel } from 'models/Committee'
import { ELECTION_COMMITTEE_ID, MAIN_BOARD_ID } from 'utils/constants'
import { RequestWithNtnuiNo } from 'utils/request'
import { getUserRoleInCommitteeByUserId } from 'utils/userCommittee'

const getCommittees = (_req: Request, res: Response) => {
	CommitteeModel.find()
		.then((committees) => res.json(committees))
		.catch((err) => res.status(404).json({ message: err.message }))
}

async function acceptAdmissions(
	req: RequestWithNtnuiNo,
	res: Response,
	next: NextFunction
) {
	try {
		const { ntnuiNo } = req
		if (!ntnuiNo) throw UnauthorizedUserError
		// Retrieve committee that is accepting admissions
		const { slug } = req.params
		const committee = await CommitteeModel.findOne({ slug })
		if (!committee) {
			return res.status(404).json({ message: 'Committee not found' })
		}
		// Control access
		const rolesInCommittees = await getUserRoleInCommitteeByUserId(ntnuiNo)
		const isAuthorized = rolesInCommittees.some(
			(userCommittee) =>
				// If user is organizer, allow toggle of all except main board
				(userCommittee.committee === MAIN_BOARD_ID &&
					committee._id !== MAIN_BOARD_ID) ||
				// If user part of election committee, allow toggle of own and main board
				(userCommittee.committee === ELECTION_COMMITTEE_ID &&
					committee._id === MAIN_BOARD_ID) ||
				// If user is board member of the committee and is not in the main board
				(userCommittee.committee === committee._id &&
					committee._id !== MAIN_BOARD_ID)
		)
		if (isAuthorized) {
			// Toggle accepts_admissions for a committee
			committee.accepts_admissions = !committee.accepts_admissions

			return await committee
				.save()
				.then(() =>
					res.status(200).json({
						accepts_admissions: committee.accepts_admissions,
					})
				)
				.catch((err) => res.status(500).json({ message: err.message }))
		}
		throw new CustomError(
			'You are not authorized to change the admission status of this committee',
			403
		)
	} catch (error) {
		return next(error)
	}
}

export { getCommittees, acceptAdmissions }
