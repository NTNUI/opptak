import { createStyles } from '@mantine/core'
import ApplicationList from '../components/ApplicationList'

const useStyles = createStyles((theme) => ({
	overview: {
		display: 'flex',
		alignItems: 'center',
		color: 'white',
		padding: '0',
		flexDirection: 'column',
		margin: 'auto',
		'@media (max-width: 415px)': {
			fontSize: 'small',
			width: '90%',
		},
		'@media (min-width: 415px)': {
			width: '80%',
		},
	},
}))

function ApplicationOverview() {
	const { classes } = useStyles()
	return (
		<div className={classes.overview}>
			<h1>Søknadsoversikt</h1>
			<ApplicationList />
		</div>
	)
}

export default ApplicationOverview
