import { Box, Button, createStyles, Loader } from '@mantine/core'
import { FileText, Login, X } from 'tabler-icons-react'
import { Form } from '../components/ApplicationForm'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAdmissionPeriod } from '../services/Applications'
import { AdmissionPeriodStatus } from '../utils/enums'
import { showNotification } from '@mantine/notifications'
import axios from 'axios'
import { ICommittee } from '../types/types'

const useStyles = createStyles((theme) => ({
	formTitleAndBodyWrapper: {
		backgroundColor: 'transparent',
		width: '35%',
		justifyContent: 'center',
		margin: 'auto auto 2rem auto',
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
		boxShadow: '0rem 0rem 1rem 0.4rem ' + theme.colors.dark[7],
		borderRadius: '20px',
		textAlign: 'left',
		color: 'white',
		'@media (max-width: 1550px)': {
			width: '45%',
		},
		'@media (max-width: 1200px)': {
			width: '60%',
		},
		'@media (max-width: 900px)': {
			width: '70%',
		},
		'@media (max-width: 700px)': {
			width: '85%',
			border: 'none',
			backgroundColor: 'transparent',
			boxShadow: 'none',
			padding: '1rem',
		},
	},
	header: {
		width: 'auto',
		margin: '2rem 0',
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 3fr 1fr 1fr',
		'@media (max-width: 700px)': {
			padding: '2rem 2rem 0',
			margin: 0,
			alignItems: 'center',
			gridTemplateColumns: '1fr',
			gridTemplateRows: 'auto',
			gap: '20px',
		},
	},
	formTitle: {
		fontWeight: 'lighter',
		fontSize: 'x-large',
		textAlign: 'center',
		margin: '1.5rem auto 0 auto',
		'*': {
			// Icon
			margin: '0 0 -3px 0',
		},
		'@media (max-width: 700px)': {
			fontSize: 'x-large',
			marginBottom: '1rem',
		},
	},
	logo: {
		gridColumn: 3,
		justifySelf: 'center',
		h1: {
			textAlign: 'center',
			color: 'white',
			fontWeight: 'lighter',
			fontSize: 'x-large',
			margin: '-10px 0 0 0',
		},
		img: {
			height: '100px',
		},
		'@media (max-width: 700px)': {
			display: 'flex',
			img: {
				maxHeight: '40px',
			},
			h1: {
				display: 'none',
			},
			justifySelf: 'start',
			gridColumn: 1,
			gridRow: 1,
		},
	},
	internButton: {
		backgroundColor: 'transparent',
		justifySelf: 'end',
		fontWeight: 'normal',
		border: '2px solid' + theme.colors.ntnui_blue[9],
		borderRadius: '5px 0 0 5px',
		borderRight: '0',
		gridColumn: 5,
		transition: '0.3s',
		'@media (max-width: 700px)': {
			'&:hover': {
				transform: 'none',
				backgroundColor: 'transparent',
			},
			padding: '0',
			border: 'none',
			justifySelf: 'end',
			gridColumn: 2,
			gridRow: 1,
		},
	},
	closedPeriod: {
		width: '40%',
		margin: 'auto',
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
		borderRadius: theme.radius.sm,
		color: 'white',
		'@media (max-width: 1200px)': {
			width: '70%',
		},
		'@media (max-width: 700px)': {
			width: '85%',
			border: 'none',
			backgroundColor: 'transparent',
			padding: '1rem',
		},
	},
	closedText: {
		textAlign: 'center',
		marginLeft: '1rem',
		marginRight: '1rem',
		'*': {
			// Icon
			margin: '0 0 -3px 0',
		},
		'@media (max-width: 700px)': {
			fontSize: 'medium',
			marginBottom: '1rem',
		},
		a: {
			color: theme.colors.ntnui_yellow[9],
		},
	},
	loading: {
		margin: 'auto',
		width: '100%',
	},
	endOfSearchPeriodText: {
		textAlign: 'center',
		fontSize: 'large',
		paddingBottom: '1rem',
	},
}))

interface FormBoxProps {
	isSL?: boolean
}

function FormBox({ isSL = false }: FormBoxProps) {
	const { classes } = useStyles()
	const navigate = useNavigate()

	const [periodStatus, setPeriodStatus] = useState<AdmissionPeriodStatus>(
		AdmissionPeriodStatus.open
	)

	const [isLoading, setIsLoading] = useState(false)
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [committees, setCommittees] = useState<ICommittee[]>([])

	useEffect(() => {
		async function getApplicationPeriodActiveAsync() {
			setIsLoading(true)
			setStartDate('')
			setEndDate('')
			setCommittees([])

			try {
				const response = await getAdmissionPeriod(isSL)
				const admissionPeriod = response.admissionPeriod
				const status = response.admissionStatus

				setPeriodStatus(status)

				if (status === AdmissionPeriodStatus.open) {
					const parsedEndDate = new Date(admissionPeriod.end_date)
						.toLocaleDateString('no-NO', {
							month: 'long',
							day: 'numeric',
							year: 'numeric',
						})
						.concat(' 23:59')

					setEndDate(parsedEndDate)

					try {
						const committeeResponse = await axios.get('/committees', {
							params: {
								sl: isSL,
							},
						})

						setCommittees(committeeResponse.data)
					} catch (error) {
						showNotification({
							id: 'committees-failed',
							title: 'Kunne ikke laste inn komiteer!',
							message:
								'Last inn siden på nytt og prøv igjen. Ta kontakt med sprint@ntnui.no dersom problemet vedvarer',
							color: 'red',
							autoClose: false,
							icon: <X size={18} />,
						})

						console.error('Could not retrieve committees:', error)
					}
				} else if (status === AdmissionPeriodStatus.upcoming) {
					const parsedStartDate = new Date(
						admissionPeriod.start_date
					).toLocaleDateString('no-NO', {
						month: 'long',
						day: 'numeric',
						year: 'numeric',
					})

					setStartDate(parsedStartDate)
				}
			} catch (error) {
				console.error('Could not retrieve admission period:', error)
			} finally {
				setIsLoading(false)
			}
		}

		getApplicationPeriodActiveAsync()
	}, [isSL])

	const loginPath = isSL ? '/studentlekene/login' : '/login'

	const applicationTitle = isSL
		? 'Søknad til Studentlekene'
		: 'Søknad til NTNUI Admin'

	const upcomingTitle = isSL
		? `Opptaket til Studentlekene starter ${startDate}!`
		: `Opptaket til NTNUI Admin starter ${startDate}!`

	const closedTitle = isSL
		? 'Studentlekene har for tiden ingen opptak'
		: 'NTNUI Admin har for tiden ingen opptak'

	return (
		<>
			<Box className={classes.header}>
				<Box className={classes.logo}>
					{isSL ? (
						<img alt='Studentlekene logo' src='/images/sl.png' />
					) : (
						<>
							<img alt='NTNUI logo' src='/images/ntnui.svg' />
							<h1>OPPTAK</h1>
						</>
					)}
				</Box>

				<Button
					onClick={() => navigate(loginPath)}
					uppercase
					className={classes.internButton}
				>
					<Login size={20} />
					Intern
				</Button>
			</Box>

			{isLoading ? (
				<Loader size='xl' color='yellow' className={classes.loading} />
			) : periodStatus === AdmissionPeriodStatus.open ? (
				<Box className={classes.formTitleAndBodyWrapper}>
					<h1 className={classes.formTitle}>
						<FileText />
						{applicationTitle}
					</h1>

					{endDate && (
						<p className={classes.endOfSearchPeriodText}>Søknadsfrist: {endDate}</p>
					)}

					<Form committees={committees} sl={isSL} />
				</Box>
			) : periodStatus === AdmissionPeriodStatus.upcoming ? (
				<Box className={classes.closedPeriod}>
					<h1 className={classes.formTitle}>{upcomingTitle}</h1>

					<div className={classes.closedText}>
						Les mer om våre utvalg på <a href='https://ntnui.no/opptak/'>ntnui.no</a>!
					</div>
				</Box>
			) : (
				<Box className={classes.closedPeriod}>
					<h1 className={classes.formTitle}>{closedTitle}</h1>

					<p className={classes.closedText}>
						{isSL ? (
							<>
								Mer informasjon om SL finner du{' '}
								<a href='https://www.sltrondheim.no/'>her</a>. Leter du etter opptak til
								en NTNUI-gruppe eller Admin? Finn gruppens egen nettside på{' '}
								<a href='https://medlem.ntnui.no/groups'>medlem.ntnui.no</a>!
							</>
						) : (
							<>
								Leter du etter opptak til en NTNUI-gruppe eller et lag? Finn gruppens
								egen nettside på{' '}
								<a href='https://medlem.ntnui.no/groups'>medlem.ntnui.no</a>!
							</>
						)}
					</p>
				</Box>
			)}
		</>
	)
}

export default FormBox
