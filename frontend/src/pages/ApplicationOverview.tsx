import { createStyles } from '@mantine/core'
import ApplicationList from '../components/ApplicationList'
import Filter from '../components/FilterSearch'

const useStyles = createStyles((theme) => ({
	overview: {
		display: 'flex',
		alignItems: 'center',
		//gap: '1rem',
		color: 'white',
		padding: '0',
		flexDirection: 'column',
		margin: 'auto',
		'@media (max-width: 500px)': {
			fontSize: 'small',
			width: '100%',
		},
		'@media (min-width: 500px)': {
			width: '80%',
		},
	},
}))

function ApplicationOverview() {
	const { classes } = useStyles()

	return (
		<div className={classes.overview}>
			<h1>Søknadsoversikt</h1>
			<Filter />
			<ApplicationList />
		</div>
	)
}

export default ApplicationOverview
