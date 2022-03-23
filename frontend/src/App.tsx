import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import ApplicationDetailPage from './pages/ApplicationDetails'
import ApplicationOverview from './pages/ApplicationOverview'
import AdmissionPeriod from './pages/AdmissionPeriod'
import Dashboard from './pages/Dashboard'
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
								<Route path='/' element={<FormPage />} />
								<Route path='login' element={<Login />} />
								<Route
									path='dashboard'
									element={
										<>
											<Navbar />
											<Dashboard />
										</>
									}
								/>
								<Route
									path='applications'
									element={
										<>
											<Navbar />
											<ApplicationOverview />
										</>
									}
								/>
								<Route
									path='admission-status'
									element={
										<>
											<Navbar />
											<h1>Opptaksstatus</h1>
										</>
									}
								/>
								<Route
									path='application-period'
									element={
										<>
											<Navbar />
											<AdmissionPeriod />
										</>
									}
								/>
								{/* TODO: remove this and move to navigate onclick item in list */}
								<Route
									path='applications/:id'
									element={
										<>
											<Navbar />
											<ApplicationDetailPage />
										</>
									}
								/>
							</Routes>
						</BrowserRouter>
					</NotificationsProvider>
				</>
			}
		/>
	)
}

export default App
