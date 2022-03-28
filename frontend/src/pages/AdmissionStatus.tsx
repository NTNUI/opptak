import { Container, createStyles, Loader } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, X } from 'tabler-icons-react'
import CommitteeSwitch from '../components/CommitteeSwitch'
import { getAdmissionPeriod } from '../services/Applications'
import {
	getAllCommittees,
	getUserCommittees,
	IRoleInCommittee,
} from '../services/Committees'

import { ICommittee } from '../types/types'
import isOrganizer from '../utils/isOrganizer'

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
		fontWeight: '300',
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
		fontWeight: '600',
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
}))

function AdmissionStatus() {
	const { classes } = useStyles()
	let navigate = useNavigate()
	const [committees, setCommittees] = useState<ICommittee[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [fromPeriod, setFromPeriod] = useState<string>('DD/MM/YYYY')
	const [toPeriod, setToPeriod] = useState<string>('DD/MM/YYYY')
	const [isError, setIsError] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState('')
	const committeeNotification = useNotifications()

	function formatDate(dateString: string) {
		const date = new Date(dateString)
		if (dateString === 'DD/MM/YYYY') {
			return 'DD/MM/YYYY'
		}
		const formattedDate = date.toLocaleDateString('en-GB', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		})
		return formattedDate
	}

	useEffect(() => {
		setIsLoading(true)
		async function getCommittees() {
			try {
				let allCommittees: ICommittee[] = []

				if (await isOrganizer()) {
					allCommittees = await getAllCommittees()
				} else {
					const committeesRes = await getUserCommittees()
					committeesRes.forEach((item: IRoleInCommittee) => {
						allCommittees.push(item.committee)
					})
				}

				setCommittees(allCommittees)
				setIsLoading(false)
			} catch (error: any) {
				if (error.response.status === 401) {
					navigate('/login')
				} else {
					committeeNotification.showNotification({
						title: 'Det skjedde en feil!',
						message: 'Det skjedde en uforutsett feil.',
						color: 'red',
						autoClose: false,
						icon: <X size={18} />,
					})
					setErrorMessage('Det finnes ingen komiteer å vise')
				}
				setIsLoading(false)
			}
		}
		getCommittees()
	}, [])

	useEffect(() => {
		async function getAdmissionPeriodData() {
			try {
				const admissionPeriodData = await getAdmissionPeriod()
				setFromPeriod(admissionPeriodData.applicationPeriod.start_date)
				setToPeriod(admissionPeriodData.applicationPeriod.end_date)
			} catch (error: any) {
				if (error.response.status === 404) {
					setIsError(true)
					setErrorMessage(
						'Opptaksperioden er ikke satt. Når den er satt vil søknader kunne sendes til ditt utvalg dersom det er åpent'
					)
				} else if (error.response.status === 500) {
					setIsError(true)
					setErrorMessage('Det skjedde en feil på serveren')
				} else {
					navigate('/dashboard')
				}
				setIsLoading(false)
			}
		}

		getAdmissionPeriodData()
	}, [navigate])

	return (
		<>
			<Container className={classes.container}>
				<>
					<h1>Opptaksstatus</h1>
					<div className={classes.text}>
						Opptaksstatus avgjør om det skal være mulig for studenter å søke i den
						gitte opptaksperioden{' '}
						{isLoading ? (
							<Loader color='white' variant='dots' />
						) : (
							<span className={classes.date}>{formatDate(fromPeriod)}</span>
						)}{' '}
						til{' '}
						{isLoading ? (
							<Loader color='white' variant='dots' />
						) : (
							<span className={classes.date}>{formatDate(toPeriod)}</span>
						)}
					</div>

					<div className={classes.committeesWrapper}>
						{isError ? (
							<div className={classes.errorMessage}>
								<AlertTriangle size={35} />
								<h1>{errorMessage}</h1>
							</div>
						) : committees.length ? (
							<Container className={classes.container}>
								{committees.map((item: ICommittee, idx: number) => (
									<CommitteeSwitch key={idx} {...item} />
								))}
							</Container>
						) : isLoading ? (
							<Loader className={classes.loader} color='yellow' size='xl' />
						) : (
							<span>Ingen komiteer å vise.</span>
						)}
					</div>
				</>
			</Container>
		</>
	)
}

export default AdmissionStatus
