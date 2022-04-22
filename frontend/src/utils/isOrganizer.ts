import { getUserCommittees, IRoleInCommittee } from './../services/User'

const MAIN_BOARD_ID = process.env.REACT_APP_ORGANIZER_ID || -69

async function isOrganizer() {
	const userCommittees: IRoleInCommittee[] = await getUserCommittees()
	return userCommittees.some(
		(roleInCommittee) => roleInCommittee.committee._id === MAIN_BOARD_ID
	)
}

export default isOrganizer
