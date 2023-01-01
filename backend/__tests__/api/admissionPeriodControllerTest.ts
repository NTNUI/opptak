import request from 'supertest'
import db from '../../config/mockDb'
import app from '../../app'
import { AdmissionPeriodModel } from '../../models/AdmissionPeriod'
import { AdmissionPeriodStatus } from '../../utils/enums'
import { yesterdayISO, todayISO, tomorrowISO } from '../../utils/timeUtils'

afterEach(async () => db.clear())
afterAll(async () => db.close())

const agent = request.agent(app)
const ADMISSION_PERIOD_PATH = '/applications/period/'

describe('GET /applications/period', () => {
	it.each([
		[AdmissionPeriodStatus.finished, yesterdayISO, yesterdayISO],
		[AdmissionPeriodStatus.open, todayISO, todayISO],
		[AdmissionPeriodStatus.upcoming, tomorrowISO, tomorrowISO],
	])(
		'should return correct status when application period is %s',
		async (expectedStatus, start_date, end_date) => {
			await AdmissionPeriodModel.create({ start_date, end_date })

			const response = await agent.get(ADMISSION_PERIOD_PATH)

			expect(response.body.admissionStatus).toBe(expectedStatus)
		}
	)

	it('should return expected dates', async () => {
		await AdmissionPeriodModel.create({
			start_date: todayISO,
			end_date: yesterdayISO,
		})

		const response = await agent.get(ADMISSION_PERIOD_PATH)

		expect(response.statusCode).toBe(200)
		expect(response.body.admissionPeriod.start_date).toBe(todayISO)
		expect(response.body.admissionPeriod.end_date).toBe(yesterdayISO)
	})

	it('should return 404 when no application period exists', async () => {
		const response = await agent.get(ADMISSION_PERIOD_PATH)
		expect(response.statusCode).toBe(404)
	})
})
