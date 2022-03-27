import axios from 'axios'
import { ICommittee } from '../types/types'

export interface IRoleInCommittee {
	committee: ICommittee
	role: string
}

export const getAllCommittees = async (): Promise<ICommittee[]> => {
	const response = await axios.get('/committees')
	return response.data
}

export const getUserCommittees = async (): Promise<IRoleInCommittee[]> => {
	const response = await axios.get('/user/committees')
	return response.data.committees
}

export const toggleAcceptApplicationsAsync = async (slug: string) => {
	const response = axios
		.put(`/committees/${slug}/accept-applicants`)
		.then((response) => {
			return response.data.accept_applicants
		})
	return response
}
