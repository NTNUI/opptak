import axios from 'axios'
import { ICommittee } from 'types/types'

export interface IRoleInCommittee {
	committee: ICommittee
	role: string
}

export const getUserCommittees = async (): Promise<IRoleInCommittee[]> => {
	const response = await axios.get('/user/committees')
	return response.data.committees
}

export interface IUserProfile {
	first_name: string
	last_name: string
	committees: IRoleInCommittee[]
}

export const getUserProfile = async (): Promise<IUserProfile> => {
	const response = await axios.get('/user/profile')
	return response.data
}
