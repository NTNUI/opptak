import axios from 'axios'
import { ICommittee } from '../types/types'

export interface ICommitteeCollection {
	committee: ICommittee
	role: string
}

export interface IUserCommitteeResponse {
	committees: ICommitteeCollection[]
}

export const getUserCommittees = async (): Promise<IUserCommitteeResponse> => {
	const response = await axios.get('/user/committees')
	return response.data
}
