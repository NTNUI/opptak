import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import FormPage from './pages/FormPage'
import colors from './utils/theme'

function App() {
	axios.defaults.baseURL = 'http://localhost:8082'
	return (
		<MantineProvider
			theme={{
				colors: colors,
			}}
			children={
				<NotificationsProvider position='top-right'>
					<FormPage />
				</NotificationsProvider>
			}
		/>
	)
}

export default App
