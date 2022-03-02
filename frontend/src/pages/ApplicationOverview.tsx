import ApplicationList from '../components/ApplicationList'

const ApplicationOverview = () => (
	<div
		style={{
			display: 'flex',
			flexDirection: 'column',
			width: '80%',
			alignItems: 'center',
			margin: 'auto',
			color: 'white',
			padding: '0',
		}}
	>
		<h1>Søknadsoversikt</h1>
		<ApplicationList />
	</div>
)

export default ApplicationOverview
