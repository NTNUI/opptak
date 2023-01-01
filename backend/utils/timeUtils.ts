const DAY_IN_MS = 24 * 60 * 60 * 1000

const today = new Date()
const todayISO = today.toISOString()

const tomorrow = new Date(Date.now() + DAY_IN_MS)
const tomorrowISO = tomorrow.toISOString()

const yesterday = new Date(Date.now() - DAY_IN_MS)
const yesterdayISO = yesterday.toISOString()

export { today, todayISO, tomorrow, tomorrowISO, yesterday, yesterdayISO };