import { MediaQuery } from '@mantine/core'
import ApplicationList from '../components/ApplicationList'
import '../pages/ApplicationOverviewStyle.css'

const ApplicationOverview = () => (
	<div id='wrapper'>
		<h1>Søknadsoversikt</h1>
		<ApplicationList />
	</div>
)

export default ApplicationOverview
