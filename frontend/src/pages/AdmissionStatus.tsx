import { Container, createStyles, Loader } from '@mantine/core'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CommitteeSwitch from '../components/CommitteeSwitch'
import { getUserCommittees, ICommitteeCollection } from '../services/Committees'

import { ICommittee } from '../types/types'

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
}))

function AdmissionStatus() {
	const { classes } = useStyles()
	let navigate = useNavigate()
	const [committees, setCommittees] = useState<ICommittee[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [fromPeriod, setFromPeriod] = useState<string>('DD/MM/YYYY')
	const [toPeriod, setToPeriod] = useState<string>('DD/MM/YYYY')

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
			const committeesRes = await getUserCommittees()
			let allCommittees: ICommittee[] = []
			committeesRes.committees.forEach((item: ICommitteeCollection) => {
				allCommittees.push(item.committee)
			})
			setCommittees(allCommittees)
			setIsLoading(false)
		}
		getCommittees()
	}, [])

	useEffect(() => {
		function getApplicationPeriod() {
			axios
				.get('/applications/period')
				.then((res) => {
					setFromPeriod(res.data.applicationPeriod.start_date)
					setToPeriod(res.data.applicationPeriod.end_date)
				})
				.catch((error: any) => {
					// If client is not able to get application period, navigate to login-page
					if (error.response.status !== 200) {
						navigate('/login')
					}
				})
		}

		getApplicationPeriod()
	}, [navigate])

	return (
		<>
			<Container className={classes.container}>
				<h1>Opptaksstatus</h1>
				<div className={classes.text}>
					Opptaksstatus avgjør om det skal være mulig for studenter å søke i den
					gitte opptaksperioden{' '}
					<span className={classes.date}>{formatDate(fromPeriod)}</span> til
					<span className={classes.date}> {formatDate(toPeriod)}</span>
				</div>
				<div className={classes.committeesWrapper}>
					{committees.length ? (
						<Container className={classes.container}>
							{committees.map((item: ICommittee, idx: number) => (
								<CommitteeSwitch key={idx} {...item} />
							))}
						</Container>
					) : isLoading ? (
						<Loader className={classes.loader} color='yellow' size='xl' />
					) : (
						<span>
							Du har ikke rettigheter til å endre opptaksstatus på noen komiteer.
						</span>
					)}
				</div>
			</Container>
		</>
	)
}

export default AdmissionStatus