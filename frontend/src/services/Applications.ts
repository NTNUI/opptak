import axios from 'axios'
import { IApplicationsResponse, IApplicationResponse } from '../types/types'

const getApplications = async (
	currentPage: number
): Promise<IApplicationsResponse> => {
	const response = await axios.get(`/applications/?page=${currentPage}`)
	return response.data
}

const getApplication = async (id: String): Promise<IApplicationResponse> => {
	const response = await axios.get(`/applications/${id}`)
	return response.data
}

export { getApplications, getApplication }
