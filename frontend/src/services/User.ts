import axios from 'axios'
import { ICommittee } from '../types/types'

export interface IRoleInCommittee {
	committee: ICommittee
	role: string
}

export const getUserCommittees = async (): Promise<IRoleInCommittee[]> => {
	const response = await axios.get('/user/committees')
	return response.data.committees
}
