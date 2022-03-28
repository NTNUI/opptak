import axios from 'axios'
import {
	IAdmissionPeriod,
	IApplicationsResponse,
	IApplicationResponse,
} from '../types/types'

const getApplications = async (
	currentPage: number
): Promise<IApplicationsResponse> => {
	const response = await axios.get(`/applications/?page=${currentPage}`)
	return response.data
}

const getAdmissionPeriod = async () => {
	const response = await axios.get(`/applications/period`)
	return response.data
}

const putAdmissionPeriod = async (admissionPeriod: IAdmissionPeriod) => {
	const response = await axios.put(`/applications/period/`, {
		...admissionPeriod,
	})
	return response.data
}

const getApplication = async (id: String): Promise<IApplicationResponse> => {
	const response = await axios.get(`/applications/${id}`)
	return response.data
}

const isApplicationPeriodActive = async (): Promise<boolean> => {
	const response = await axios.get('/applications/period/active')
	return response.data.response
}

export {
	getApplications,
	getApplication,
	getAdmissionPeriod,
	putAdmissionPeriod,
	isApplicationPeriodActive
}
