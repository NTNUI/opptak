interface IGroup {
	_id: Number
	name: string
	slug: string
}

function printSlug(committee: IGroup) {
	console.log(committee.slug) // eslint-disable-line no-console
}

export = printSlug
