interface IApplication {
	name: string
	phoneNumber: string
	email: string
	text: string
	committees: ICommittee[]
	submitted_date: Date
}
interface ICommittee {
	name: string
}

export type { IApplication, ICommittee }
