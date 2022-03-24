import axios from 'axios'
import { IApplicationPeriod, IApplicationResponse } from '../types/types'

const getApplications = async (
	currentPage: number
): Promise<IApplicationResponse> => {
	const response = await axios.get(`/applications/?page=${currentPage}`)
	return response.data
}

const getApplicationPeriod = async () => {
	const response = await axios.get(`/applications/period`)
	return response.data
}

const putApplicationPeriod = async (applicationPeriod: IApplicationPeriod) => {
	const response = await axios.put(`/applications/period/`, {
		...applicationPeriod,
	})
	return response.data
}

export { getApplications, getApplicationPeriod, putApplicationPeriod }
