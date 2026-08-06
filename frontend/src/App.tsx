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
import SLFormPage from './pages/SL/SLFormPage'
import SLAdmissionPeriod from './pages/SL/SLAdmissionPeriod'
import Login from './pages/Login'
import colors from './utils/theme'
import RequireAuth from './utils/authRouter'
import SLDashboard from './pages/SL/SLDashboard'
import SLlogin from './pages/SL/SLLogin'
import SLApplicationOverview from './pages/SL/SLApplicationOverview'
import SLAdmissionStatus from './pages/SL/SLAdmissionStatus'

function App() {
	axios.defaults.baseURL =
		process.env.REACT_APP_BACKEND_URI || 'https://api.opptak.ntnui.no'
	axios.defaults.withCredentials = true

	// eslint-disable-next-line no-console
	console.log(
		'%cLaget av %cNTNUI Sprint',
		'font-weight: bold; font-size: 1rem;color: yellow;',
		'font-weight: bold; padding-bottom: 10px; padding-right: 10px; font-size: 3rem;color: yellow; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 green , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)'
	)
	// eslint-disable-next-line no-console
	console.log(
		'%cSnoker rundt du? Det liker vi. Sprint ser etter nye medlemmer.',
		'font-weight: bold; font-size: 1rem;color: yellow;',
		''
	)

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
										<RequireAuth>
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
										<RequireAuth>
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
										<RequireAuth>
											<>
												<Navbar />
												<AdmissionPeriod />
											</>
										</RequireAuth>
									}
								/>
								<Route path='/studentlekene' element={<SLFormPage />} />
								<Route path='/studentlekene/login' element={<SLlogin />} />
								<Route 
									path='/studentlekene/dashboard' 
									element={
										<RequireAuth>
											<>
												<Navbar />
												<SLDashboard />
											</>
										</RequireAuth>
									} 
								/>
								<Route
									path='/studentlekene/admission-status'
									element={
										<RequireAuth>
											<>
												<Navbar />
												<SLAdmissionStatus />
											</>
										</RequireAuth>
									}
								/>
								<Route 
									path='/studentlekene/admission-period' 
									element={
										<RequireAuth>
											<>
												<Navbar />
												<SLAdmissionPeriod />
											</>
										</RequireAuth>
									} 
								/>
								<Route
									path='/studentlekene/applications'
									element={
										<RequireAuth>
											<>
												<Navbar />
												<SLApplicationOverview />
											</>
										</RequireAuth>
									}
								/>
								<Route
									path='/studentlekene/applications/:id'
									element={
										<RequireAuth>
											<>
												<Navbar />
												<ApplicationDetailPage />
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
