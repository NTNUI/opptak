interface IApplication {
	_id: string
	name: string
	phone_number: string
	email: string
	text: string
	committees: ICommittee[]
	submitted_date: Date
}

interface IApplicationsResponse {
	applications: IApplication[]
	currentPage: number
	numberOfPages: number
}

interface IApplicationResponse {
	application: IApplication
}

interface ICommittee {
	_id: number
	name: string
	slug: string
	accepts_applicants: boolean
	access_roles: string[]
}

interface IAdmissionPeriod {
	start_date: string
	end_date: string
}

export type { IApplication, ICommittee, IApplicationResponse, IApplicationsResponse, IAdmissionPeriod }
