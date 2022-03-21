import axios from 'axios'
import { IApplicationResponse } from '../types/types'

const getApplications = async (
	currentPage: number
): Promise<IApplicationResponse> => {
	const response = await axios.get(`/applications/?page=${currentPage}`)
	return response.data
}

export default getApplications
