import { Container, createStyles, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, X } from 'tabler-icons-react'
import CommitteeSwitch from '../components/CommitteeSwitch'
import { getAdmissionPeriod } from '../services/Applications'
import {
	getAllCommittees,
	getUserCommittees,
} from '../services/Committees'

import { ICommittee } from '../types/types'
import { REACT_APP_STUDENTLEKENE_ID } from '../utils/constants'

const useStyles = createStyles((theme) => ({
	container: {
		display: 'flex',
		width: '100%',
		gap: '1rem',
		alignItems: 'center',
		flexDirection: 'column',
		margin: '2rem auto',
		color: 'white',
		borderRadius: '5px',
		h1: {
			margin: 0,
		},
		'@media (max-width: 500px)': {
			width: '90%',
		},
	},
	text: {
		textAlign: 'center',
		width: '60%',

		'@media (max-width: 500px)': {
			width: '90%',
		},
	},
	committeesWrapper: {
		display: 'flex',
		flexDirection: 'column',
		padding: '0.5rem',
		gap: '1rem',
		margin: 'auto',
		width: '60%',
		'@media (max-width: 500px)': {
			width: '90%',
		},
	},
	committees: {
		color: theme.colors.gray[2],
		border: '2px solid #F8F082',
		padding: '0.75rem 1.25rem',
		borderRadius: theme.radius.sm,
		whiteSpace: 'nowrap',
		fontWeight: 300,
		fontSize: 'medium',
		display: 'flex',
		justifyContent: 'space-between',
	},
	switch: {
		input: {
			background: theme.colors.ntnui_red[9],
			border: 'none',
			'&:checked': {
				background: theme.colors.ntnui_green[9],
			},
		},
	},
	date: {
		fontWeight: 600,
	},
	loader: {
		margin: '2rem auto',
	},
	errorMessage: {
		color: 'white',
		margin: '2rem auto',
		width: '90%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		h1: {
			fontWeight: 'lighter',
			fontSize: 'x-large',
		},
		svg: {
			color: theme.colors.ntnui_yellow[9],
			margin: '0 5px 0 0',
		},
	},
	warningAlertIcon: {
		color: theme.colors.ntnui_yellow[9],
	},
}))

interface AdmissionStatusProps {
	isSL?: boolean
}

interface StateType {
	isOrganizer?: boolean
	isElectionCommittee?: boolean
}

function AdmissionStatus({ isSL = false }: AdmissionStatusProps) {
	const { classes } = useStyles()
	const navigate = useNavigate()
	const location = useLocation()

	const [committees, setCommittees] = useState<ICommittee[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [fromPeriod, setFromPeriod] = useState('DD/MM/YYYY')
	const [toPeriod, setToPeriod] = useState('DD/MM/YYYY')
	const [periodIsMissing, setPeriodIsMissing] = useState(false)
	const [isError, setIsError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	function formatDate(dateString: string) {
		if (dateString === 'DD/MM/YYYY') {
			return 'DD/MM/YYYY'
		}

		return new Date(dateString).toLocaleDateString('en-GB', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		})
	}

	useEffect(() => {
		async function loadAdmissionStatus() {
			setIsLoading(true)
			setIsError(false)
			setErrorMessage('')
			setPeriodIsMissing(false)

			try {
				const userCommittees = await getUserCommittees()

				let allCommittees: ICommittee[] = []

				if (isSL) {
					const isUserInStudentlekeneBoard =
						userCommittees.some(
							(roleInCommittee) =>
								roleInCommittee.committee._id ===
								REACT_APP_STUDENTLEKENE_ID
						)

					if (!isUserInStudentlekeneBoard) {
						navigate('/dashboard')
						return
					}

					allCommittees = await getAllCommittees(true)

					allCommittees = allCommittees.filter(
						(committee) => committee.sl === true
					)
				} else {
					const locationState =
						location.state as StateType | null

					if (locationState?.isOrganizer) {
						allCommittees = await getAllCommittees()

						allCommittees = allCommittees.filter(
							(committee) =>
								committee.slug !== 'valgkomiteen' &&
								committee.slug !== 'hovedstyret'
						)
					} else if (
						locationState?.isElectionCommittee
					) {
						allCommittees = await getAllCommittees()

						allCommittees = allCommittees.filter(
							(committee) =>
								committee.slug === 'hovedstyret' ||
								committee.slug === 'lovutvalget'
						)

						const otherUserCommittees =
							userCommittees
								.map(
									(roleInCommittee) =>
										roleInCommittee.committee
								)
								.filter(
									(committee) =>
										committee.slug !==
										'valgkomiteen'
								)

						allCommittees.push(
							...otherUserCommittees
						)
					} else {
						allCommittees = userCommittees.map(
							(roleInCommittee) =>
								roleInCommittee.committee
						)
					}
				}

				// Remove duplicate committees
				const uniqueCommittees = Array.from(
					new Map<number, ICommittee>(
						allCommittees.map((committee) => [
							committee._id,
							committee,
						])
					).values()
				)

				setCommittees(uniqueCommittees)

				try {
					const admissionPeriodData =
						await getAdmissionPeriod(isSL)

					setFromPeriod(
						admissionPeriodData.admissionPeriod
							.start_date
					)

					setToPeriod(
						admissionPeriodData.admissionPeriod
							.end_date
					)
				} catch (error: any) {
					const status = error.response?.status

					if (status === 404) {
						setPeriodIsMissing(true)
					} else if (status === 401) {
						navigate(
							isSL
								? '/studentlekene/login'
								: '/login'
						)
					} else if (status === 500) {
						setIsError(true)
						setErrorMessage(
							'Det skjedde en feil på serveren'
						)
					} else {
						setIsError(true)
						setErrorMessage(
							'Klarte ikke å hente opptaksstatus'
						)
					}
				}
			} catch (error: any) {
				const status = error.response?.status

				if (status === 401) {
					navigate(
						isSL
							? '/studentlekene/login'
							: '/login'
					)
				} else {
					showNotification({
						title: 'Det skjedde en feil!',
						message:
							'Det skjedde en uforutsett feil.',
						color: 'red',
						autoClose: false,
						icon: <X size={18} />,
					})

					setIsError(true)
					setErrorMessage(
						isSL
							? 'Det finnes ingen SL-komiteer å vise'
							: 'Det finnes ingen komiteer å vise'
					)
				}
			} finally {
				setIsLoading(false)
			}
		}

		loadAdmissionStatus()
	}, [isSL, location.state, navigate])

	return (
		<Container className={classes.container}>
			<h1>
				{isSL
					? 'Opptaksstatus for Studentlekene'
					: 'Opptaksstatus'}
			</h1>

			{!periodIsMissing ? (
				<div className={classes.text}>
					Opptaksstatus avgjør om det skal være mulig
					for studenter å søke i den gitte
					opptaksperioden{' '}
					{isLoading ? (
						<Loader
							color='white'
							variant='dots'
						/>
					) : (
						<span className={classes.date}>
							{formatDate(fromPeriod)}
						</span>
					)}{' '}
					til{' '}
					{isLoading ? (
						<Loader
							color='white'
							variant='dots'
						/>
					) : (
						<span className={classes.date}>
							{formatDate(toPeriod)}
						</span>
					)}
				</div>
			) : (
				<div className={classes.text}>
					<AlertTriangle
						size={35}
						className={
							classes.warningAlertIcon
						}
					/>
					<br />
					Opptaksperioden er ikke satt. Når den er
					satt vil søknader kunne sendes til ditt
					utvalg dersom det er åpent.
				</div>
			)}

			<div className={classes.committeesWrapper}>
				{isError ? (
					<div className={classes.errorMessage}>
						<AlertTriangle size={35} />
						<h1>{errorMessage}</h1>
					</div>
				) : isLoading ? (
					<Loader
						className={classes.loader}
						color='yellow'
						size='xl'
					/>
				) : committees.length > 0 ? (
					<Container className={classes.container}>
						{committees.map((committee) => (
							<CommitteeSwitch
								key={committee._id}
								{...committee}
								sl={isSL}
							/>
						))}
					</Container>
				) : (
					<div className={classes.errorMessage}>
						<AlertTriangle size={35} />
						<h1>
							{isSL
								? 'Det finnes ingen SL-komiteer å vise'
								: 'Det finnes ingen komiteer å vise'}
						</h1>
					</div>
				)}
			</div>
		</Container>
	)
}

export default AdmissionStatus