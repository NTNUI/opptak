import { Container, MantineProvider } from '@mantine/core'
import './App.css'
import ApplicationOverview from './pages/ApplicationOverview'
import colors from './utils/theme'

function App() {
	return (
		<MantineProvider
			theme={{
				colors: colors,
			}}
		>
			<Container>
				<ApplicationOverview />
			</Container>
		</MantineProvider>
	)
}

export default App
