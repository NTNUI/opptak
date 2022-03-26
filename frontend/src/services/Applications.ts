import axios from 'axios'
import { IAdmissionPeriod, IApplicationResponse } from '../types/types'

const getApplications = async (
	currentPage: number
): Promise<IApplicationResponse> => {
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

export { getApplications, getAdmissionPeriod, putAdmissionPeriod }
