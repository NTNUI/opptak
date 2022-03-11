import { Container, MantineProvider } from '@mantine/core'
import axios from 'axios'
import './App.css'
import ApplicationOverview from './pages/ApplicationOverview'
import colors from './utils/theme'

function App() {
	axios.defaults.baseURL = 'http://localhost:8082'
	return (
		<MantineProvider
			theme={{
				colors: colors,
			}}
			children={
				<Container>
					<ApplicationOverview />
				</Container>
			}
		/>
	)
}

export default App
