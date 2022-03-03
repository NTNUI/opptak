interface GroupI {
	_id: Number
	name: string
	slug: string
}

function printSlug(committee: GroupI) {
	console.log(committee.slug) // eslint-disable-line no-console
}

export = printSlug
