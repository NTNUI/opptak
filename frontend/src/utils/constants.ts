export const REACT_APP_MAIN_BOARD_ID =
	Number(process.env.REACT_APP_MAIN_BOARD_ID) || 52

export const REACT_APP_ELECTION_COMMITTEE_ID =
	Number(process.env.REACT_APP_ELECTION_COMMITTEE_ID) || 53

export const MAIN_BOARD_NAME =
	new Date().getMonth() < 6 ? 'Hovedstyret' : 'Introstyret'
