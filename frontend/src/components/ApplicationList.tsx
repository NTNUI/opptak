import { Container, createStyles } from '@mantine/core'
import ApplicationItem from './ApplicationItem'
import { IApplication } from '../types/types'
import { useNavigate } from 'react-router-dom'

const useStyles = createStyles((theme) => ({
	container: {
		display: 'flex',
		padding: '0',
		flexDirection: 'column',
		gap: '1rem',
		maxWidth: '100%',
		'@media (max-width: 600px)': {
			width: '90%',
		},
		'@media (min-width: 600px)': {
			width: '80%',
		},
		'@media (min-width: 1200px)': {
			width: '70%',
		},
	},
}))

type ApplicationListProps = {
	applications: IApplication[]
}

function ApplicationList(applications: ApplicationListProps) {
	let navigate = useNavigate()

	function itemClickHandler(id: string) {
		navigate(id)
	}

	const { classes } = useStyles()
	return (
		<Container className={classes.container}>
			{applications.applications.map((item: IApplication, idx: number) => (
				<ApplicationItem key={idx} handleClick={itemClickHandler} {...item} />
			))}
		</Container>
	)
}

export default ApplicationList
