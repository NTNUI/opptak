/* eslint-disable no-console */
const MAIN_BOARD_ID = Number(process.env.MAIN_BOARD_ID) || 52
const ELECTION_COMMITTEE_ID = Number(process.env.ELECTION_COMMITTEE_ID) || 71

console.log(`🔗 MAIN_BOARD_ID set to ${MAIN_BOARD_ID}`)
console.log(`🔗 ELECTION_COMMITTEE_ID set to ${ELECTION_COMMITTEE_ID}`)

export { MAIN_BOARD_ID, ELECTION_COMMITTEE_ID }
