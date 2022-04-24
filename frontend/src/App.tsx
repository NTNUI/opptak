import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import AdmissionStatus from './pages/AdmissionStatus'
import ApplicationOverview from './pages/ApplicationOverview'
import AdmissionPeriod from './pages/AdmissionPeriod'
import ApplicationDetailPage from './pages/ApplicationDetails'
import Dashboard from './pages/Dashboard'
import FormPage from './pages/FormPage'
import Login from './pages/Login'
import colors from './utils/theme'
import RequireAuth from './utils/authRouter'

function App() {
	axios.defaults.baseURL =
		process.env.REACT_APP_BASE_URL || 'http://localhost:8082'
	axios.defaults.withCredentials = true
	return (
		<MantineProvider
			theme={{
				fontFamily: 'Poppins, sans-serif',
				colors: colors,
			}}
			children={
				<>
					<NotificationsProvider position='top-center'>
						<BrowserRouter>
							<Routes>
								<Route path='/' element={<FormPage />} />
								<Route path='/login' element={<Login />} />
								<Route
									path='/dashboard'
									element={
										<RequireAuth organizer>
											<>
												<Navbar />
												<Dashboard />
											</>
										</RequireAuth>
									}
								/>
								<Route
									path='/applications'
									element={
										<RequireAuth>
											<>
												<Navbar />
												<ApplicationOverview />
											</>
										</RequireAuth>
									}
								/>
								<Route
									path='/applications/:id'
									element={
										<RequireAuth>
											<>
												<Navbar />
												<ApplicationDetailPage />
											</>
										</RequireAuth>
									}
								/>
								<Route
									path='/admission-status'
									element={
										<RequireAuth organizer>
											<>
												<Navbar />
												<AdmissionStatus />
											</>
										</RequireAuth>
									}
								/>
								<Route
									path='/admission-period'
									element={
										<RequireAuth organizer>
											<>
												<Navbar />
												<AdmissionPeriod />
											</>
										</RequireAuth>
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
