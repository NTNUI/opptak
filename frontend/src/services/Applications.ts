import axios from 'axios'
import {
	IAdmissionPeriod,
	IApplicationsResponse,
	IApplicationResponse,
} from '../types/types'

const getApplications = async (
	query: string
): Promise<IApplicationsResponse> => {
	const response = await axios.get(`/applications/?${query}`)
	return response.data
}

const getAdmissionPeriod = async () => {
	const response = await axios.get(`/applications/period/`)
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

const wipeApplicationData = async () => {
	const response = await axios.delete('/applications/')
	return response
}

export {
	getApplications,
	getApplication,
	getAdmissionPeriod,
	putAdmissionPeriod,
	wipeApplicationData,
}
