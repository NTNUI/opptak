import { Container, createStyles } from '@mantine/core'
import ApplicationItem from './ApplicationItem'
import { IApplication } from '../types/application'
import { useEffect, useState } from 'react'
import axios from 'axios'

// let applications = require('../fixtures/applications.json')

const useStyles = createStyles((theme) => ({
	container: {
		width: '100%',
		display: 'flex',
		padding: '0',
		flexDirection: 'column',
		gap: '1rem',
		margin: 'auto',
	},
}))

function ApplicationList() {
	const [applications, setApplications] = useState<IApplication[]>([])

	useEffect(() => {
		axios
			.get('http://localhost:8082/applications/')
			.then((res) => setApplications(res.data.applications))
			.catch((err) => console.log(err))
	}, [])

	const { classes } = useStyles()
	return (
		<Container className={classes.container}>
			{applications
				? applications.map((item: IApplication, idx: number) => (
						<ApplicationItem key={idx} {...item} />
				  ))
				: 'No applications found'}
		</Container>
	)
}

export default ApplicationList
