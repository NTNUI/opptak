import { Container, createStyles } from '@mantine/core'
import ApplicationItem from './ApplicationItem'
import ApplicationI from '../types/application'

let applications = require('../fixtures/applications.json')

let formatted = applications.map((item: ApplicationI, idx: number) => {
	return <ApplicationItem key={idx} {...item} />
})

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
	const { classes } = useStyles()
	return <Container className={classes.container}>{formatted}</Container>
}

export default ApplicationList
