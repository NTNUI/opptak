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
	const response = await axios.get(`/applications/period`)
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

const isApplicationPeriodActive = async (): Promise<boolean> => {
	const response = await axios.get('/applications/period/active')
	return response.data.response
}

const wipeApplicationData = async () => {
	const response = await axios.delete('/applications/')
	return response
}

function constructSearchFilterQuery(
	chosenCommittees: string[],
	sort: string,
	status: string,
	nameSearch: string
) {
	let committeesFilterString = ''
	let statusString = ''
	let sortString = `sort=${sort}`
	let searchString = ''
	chosenCommittees.forEach((committee: string) => {
		committeesFilterString += `&committee=${committee}`
	})

	if (status !== '') {
		statusString = `status=${status}`
	}
	if (nameSearch !== '') {
		searchString = `name=${nameSearch}`
	}

	let searchQuery = new URLSearchParams(
		committeesFilterString +
			'&' +
			statusString +
			'&' +
			sortString +
			'&' +
			searchString
	)

	return searchQuery
}

export {
	getApplications,
	getApplication,
	getAdmissionPeriod,
	putAdmissionPeriod,
	isApplicationPeriodActive,
	wipeApplicationData,
	constructSearchFilterQuery,
}
