import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { verifyToken } from '../services/Auth'
import { getUserCommittees, IRoleInCommittee } from '../services/Committees'

type RequireAuthProps = {
	children: JSX.Element
}

function RequireAuth({ children }: RequireAuthProps) {
	const [authed, setAuthed] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isTheOrganizer, setIsTheOrganizer] = useState<boolean>(false)
	const [isInElectionCommittee, setIsInElectionCommittee] =
		useState<boolean>(false)

	const location = useLocation()
	location.state = {
		isOrganizer: isTheOrganizer,
		isElectionCommittee: isInElectionCommittee,
	}
	useEffect(() => {
		const requestAsync = async () => {
			setIsLoading(true)
			try {
				// Verify if user is logged in
				const response = await verifyToken()
				if (response.status === 200) {
					setAuthed(true)
				}
				// Check if user is organizer or election committee
				const userCommittees = await getUserCommittees()
				userCommittees.forEach((roleInCommittee: IRoleInCommittee) => {
					if (roleInCommittee.committee.slug === 'hovedstyret') {
						setIsTheOrganizer(true)
					} else if (roleInCommittee.committee.slug === 'valgkomiteen') {
						setIsInElectionCommittee(true)
					}
				})
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
