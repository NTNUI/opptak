import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ApplicationOverview from './pages/ApplicationOverview'
import FormPage from './pages/FormPage'
import Login from './pages/Login'
import colors from './utils/theme'

function App() {
	axios.defaults.baseURL = 'http://localhost:8082'
	axios.defaults.withCredentials = true
	return (
		<MantineProvider
			theme={{
				colors: colors,
			}}
			children={
				<>
					<NotificationsProvider position='top-right'>
						<BrowserRouter>
							<Routes>
								<Route path='/' element={<FormPage/>} />
								<Route path='login' element={<Login />} />
								<Route path='applications' element={<ApplicationOverview />} />
							</Routes>
						</BrowserRouter>
					</NotificationsProvider>
				</>
			}
		/>
	)
}

export default App
