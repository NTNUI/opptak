import { getUserCommittees, IRoleInCommittee } from './../services/User'

const MAIN_BOARD_ID = 9 // TODO: Set in env?

async function isOrganizer() {
	const userCommittees: IRoleInCommittee[] = await getUserCommittees()
	return userCommittees.some(
		(roleInCommittee) => roleInCommittee.committee._id === MAIN_BOARD_ID
	)
}

export default isOrganizer
