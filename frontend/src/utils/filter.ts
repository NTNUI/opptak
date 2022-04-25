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

export default constructSearchFilterQuery
