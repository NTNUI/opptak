import { StatusTypes } from '../utils/enums'

export interface IStatus {
	_id: string
	value: StatusTypes
	set_by: string | null
	committee: number
	updated_date: Date
}

export interface IPopulatedStatus {
	_id: string
	value: StatusTypes
	set_by: string | null
	committee: {
		name: string
		slug: string
		_id: number
	}
	updated_date: Date
}

interface IApplication {
	_id: string
	name: string
	phone_number: string
	email: string
	text: string
	main_board_text: string
	committees: ICommittee[]
	submitted_date: Date
	statuses: IStatus[]
}

interface IApplicationsResponse {
	applications: IApplication[]
	pagination: {
		currentPage: number
		numberOfPages: number
	}
}

interface IApplicationResponse {
	application: IApplication
}

interface ICommittee {
	_id: number
	name: string
	slug: string
	accepts_admissions: boolean
	access_roles: string[]
}

interface IAdmissionPeriod {
	start_date: string
	end_date: string
}

interface ICommitteeResponse {
	accepts_admissions: boolean
}

export type {
	IApplication,
	ICommittee,
	IApplicationResponse,
	IApplicationsResponse,
	IAdmissionPeriod,
	ICommitteeResponse,
}
