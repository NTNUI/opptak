import axios from 'axios'
import { ICommittee } from 'types/types'

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

export const toggleAcceptsAdmissions = async (slug: string) => {
	const response = axios
		.put(`/committees/${slug}/accept-admissions`)
		.then((response) => {
			return response.data.accepts_admissions
		})
	return response
}
