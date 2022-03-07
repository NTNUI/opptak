import { createStyles, MultiSelect } from '@mantine/core'
import axios from 'axios'

import React, { useEffect, useState } from 'react'

const useStyles = createStyles((theme) => ({
	select: {
		color: 'white',
	},
}))

const data = [
	{ value: 'react', label: 'React' },
	{ value: 'ng', label: 'Angular' },
	{ value: 'svelte', label: 'Svelte' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'riot', label: 'Riot' },
	{ value: 'next', label: 'Next.js' },
	{ value: 'blitz', label: 'Blitz.js' },
]

function Committees() {
	const { classes } = useStyles()
	const [committees, setCommittees] = useState([])
	useEffect(() => {
		axios
			.get('http://localhost:8082/committees/')
			.then((res) => console.log(res))
			.catch((err) => console.log(err))
	}, [])
	return (
		<MultiSelect
			data={data}
			label={<span className={classes.select}>Hva ønsker du å søke?</span>}
			searchable
		/>
	)
}

export default Committees
