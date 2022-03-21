interface IApplication {
	name: string
	phone_number: string
	email: string
	text: string
	committees: ICommittee[]
	submitted_date: Date
}

interface IApplicationResponse {
	applications: IApplication[]
	currentPage: number
	numberOfPages: number
}

interface ICommittee {
	_id: number
	name: string
	slug: string
}

export type { IApplication, ICommittee, IApplicationResponse }
