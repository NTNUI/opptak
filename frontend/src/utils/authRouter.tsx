import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { verifyToken } from '../services/Auth'
import isOrganizer from './isOrganizer'

type RequireAuthProps = {
	children: JSX.Element
	organizer?: boolean
}

function RequireAuth({ children, organizer }: RequireAuthProps) {
	const [authed, setAuthed] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isTheOrganizer, setIsTheOrganizer] = useState<boolean>(false)
	const location = useLocation()
	location.state = { isOrganizer: isTheOrganizer }

	useEffect(() => {
		const requestAsync = async () => {
			setIsLoading(true)
			try {
				// Verify if user is logged in
				const response = await verifyToken()
				if (response.status === 200) {
					setAuthed(true)
				}
				// Check if user is organizer
				if (organizer && (await isOrganizer())) {
					setIsTheOrganizer(true)
				}
				setIsLoading(false)
			} catch (error) {
				setIsLoading(false)
			}
		}
		requestAsync()
	}, [])

	return isLoading ? null : authed === true ? (
		children
	) : (
		<Navigate to='/login' replace state={{ path: location.pathname }} />
	)
}

export default RequireAuth
