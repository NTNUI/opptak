import { getUserCommittees, IRoleInCommittee } from './../services/User'

const MAIN_BOARD_ID = process.env.REACT_APP_MAIN_BOARD_ID || 52

async function isOrganizer() {
	const userCommittees: IRoleInCommittee[] = await getUserCommittees()
	return userCommittees.some(
		(roleInCommittee) => roleInCommittee.committee._id === MAIN_BOARD_ID
	)
}

export default isOrganizer
