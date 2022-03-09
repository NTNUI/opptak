interface IApplication {
	name: string
	phone_number: string
	email: string
	text: string
	committees: ICommittee[]
	submitted_date: Date
}
interface ICommittee {
	_id: number
	name: string
	slug: string
}

export type { IApplication, ICommittee }
