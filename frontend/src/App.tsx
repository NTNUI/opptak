import { ThemeProvider } from '@emotion/react'
import { Button, Container, MantineProvider } from '@mantine/core'
import './App.css'
import ApplicationOverview from './pages/ApplicationOverview'

function App() {
	return (
		<MantineProvider
			theme={{
				colors: {
					ntnui_yellow: [
						'#f1edc8',
						'#f2edc1',
						'#f3eeb9',
						'#f4eeb1',
						'#f5eeaa',
						'#f5efa2',
						'#f6ef9a',
						'#f7ef92',
						'#f7f08a',
						'#f8f082',
					],
					ntnui_green: [
						'#d6f9db',
						'#c4f1ca',
						'#b3e9b9',
						'#a2e0a8',
						'#90d897',
						'#7fcf85',
						'#6dc674',
						'#5bbe62',
						'#47b550',
						'#2fac3d',
					],
					ntnui_red: [
						'#b59191',
						'#bc8888',
						'#c37f7e',
						'#c87674',
						'#cd6c69',
						'#d1625f',
						'#d45753',
						'#d74b48',
						'#d93e3c',
						'#da2f2f',
					],
					ntnui_blue: [
						'#c9d7ff',
						'#baccff',
						'#abc0ff',
						'#9cb4ff',
						'#8da9ff',
						'#7e9dff',
						'#6f91ff',
						'#5f85ff',
						'#4e79ff',
						'#3b6dff',
					],
					ntnui_background: [
						'#3a3e46',
						'#363b43',
						'#333740',
						'#2f343d',
						'#2c303a',
						'#282d37',
						'#252a34',
						'#222632',
						'#1e232f',
						'#1b202c',
					],
				},
			}}
		>
			<Container>
				<ApplicationOverview />
			</Container>
		</MantineProvider>
	)
}

export default App
