import {
	Box,
	Button,
	createStyles,
	Group,
	Loader,
	Transition,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CalendarEvent, FileText, Trash, Users } from 'tabler-icons-react'
import { getAdmissionPeriod } from '../services/Applications'
import { IUserProfile, getUserProfile } from '../services/User'
import dayjs from 'dayjs'
import WipeModal from '../components/WipeAdmissionDataModal'
import { AdmissionPeriodStatus } from '../utils/enums'
require('dayjs/locale/nb')

const useStyles = createStyles((theme) => ({
	dashboardWrapper: {
		margin: '1rem',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		color: 'white',
	},
	metroBoxWrapper: {
		paddingTop: '1rem',
		margin: 0,
		height: '100%',
		display: 'flex',
		flexDirection: 'row',
		gap: '1.5rem',
		alignItems: 'center',
		color: theme.colors.ntnui_yellow[9],
		'@media (max-width: 900px)': {
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: 'center',
			alignItems: 'center',
		},
	},
	metroBoxes: {
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
		width: '170px',
		borderRadius: theme.radius.sm,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: '1rem',
		padding: '1rem',
		cursor: 'pointer',
		transition: 'ease-in-out 0.1s',
		'&:active': {
			transform: 'scale(0.98)',
			color: '#F8F082',
			boxShadow: '0 0 2px #F8F082',
		},
		'&:hover': {
			color: '#F8F082',
			boxShadow: '0 0 10px #F8F082',
		},
	},
	date: {
		color: theme.colors.ntnui_blue[9],
		fontWeight: 600,
		textAlign: 'center',
		fontSize: '1.3rem',
	},
	text: {
		textAlign: 'center',
		fontWeight: 'lighter',
		'*': {
			// Icon
			margin: '0 0 -3px 0',
		},
	},
	header: {
		fontWeight: 500,
	},
	subHeader: {
		fontWeight: 'lighter',
	},
	wipeDataButton: {
		marginTop: '6rem',
		backgroundColor: 'transparent',
		transition: '0.3s',
		border: '2px solid' + theme.colors.ntnui_red[9],
		color: theme.colors.ntnui_red[9],
		fontWeight: 500,
		textTransform: 'uppercase',
		':hover': {
			color: 'white',
			border: '2px solid' + theme.colors.ntnui_red[9],
			backgroundColor: theme.colors.ntnui_red[9],
		},
	},
}))

interface stateType {
	isOrganizer: boolean
}

function Dashboard() {
	const { classes } = useStyles()
	const navigate = useNavigate()
	const location = useLocation()
	const [periodStatus, setPeriodStatus] = useState<AdmissionPeriodStatus>(
		AdmissionPeriodStatus.open
	)
	const [startDate, setStartDate] = useState<string>('')
	const [endDate, setEndDate] = useState<string>('')
	const [isTheOrganizer, setTheOrganizer] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [userName, setUserName] = useState<IUserProfile>()
	const [wipeModalOpen, setWipeModalOpen] = useState<boolean>(false)

	useEffect(() => {
		const getDashboardDataAsync = async () => {
			setIsLoading(true)
			try {
				const user = await getUserProfile()
				setUserName(user)

				const locationState = location.state as stateType
				setTheOrganizer(locationState.isOrganizer)

				const response = await getAdmissionPeriod()
				const admissionPeriod = response.admissionPeriod
				setPeriodStatus(response.admissionStatus)

				const parsedStartDate = dayjs(admissionPeriod.start_date)
					.locale('nb')
					.format('D. MMMM YYYY')
				const parsedEndDate = dayjs(admissionPeriod.end_date)
					.locale('nb')
					.format('D. MMMM YYYY')
				setStartDate(parsedStartDate)
				setEndDate(parsedEndDate)
			} finally {
				setIsLoading(false)
			}
		}
		getDashboardDataAsync()
	}, [])

	return (
		<>
			<WipeModal opened={wipeModalOpen} setOpened={setWipeModalOpen} />
			{isLoading && (
				<Group position='center'>
					<Loader size='xl' color='yellow' />
				</Group>
			)}
			<Box className={classes.dashboardWrapper}>
				{!isLoading && (
					<Transition
						mounted={!isLoading}
						transition='fade'
						duration={100}
						timingFunction='ease'
					>
						{(styles) => (
							<>
								<h1 style={styles} className={classes.text}>
									<span className={classes.header}>
										<span className={classes.subHeader}>Hei, </span>
										{userName?.first_name} {userName?.last_name}
									</span>
								</h1>
								<p style={styles} className={classes.text}>
									{periodStatus === AdmissionPeriodStatus.open &&
									startDate &&
									endDate ? (
										<>
											<CalendarEvent size={24} strokeWidth={1.5} /> Opptaksperioden er satt
											fra <span className={classes.date}>{startDate}</span> til{' '}
											<span className={classes.date}>{endDate}</span>
										</>
									) : periodStatus === AdmissionPeriodStatus.finished ? (
										<>
											Opptaksperioden avsluttet{' '}
											<span className={classes.date}>{endDate}</span>
										</>
									) : (
										<>
											Opptaksperioden begynner{' '}
											<span className={classes.date}>{startDate}</span>
										</>
									)}
								</p>
								<div style={styles} className={classes.metroBoxWrapper}>
									<Box
										className={classes.metroBoxes}
										onClick={() => navigate('/applications')}
									>
										<FileText size={150} strokeWidth={0.9} /> Søknader
									</Box>
									<Box
										className={classes.metroBoxes}
										onClick={() => navigate('/admission-status')}
									>
										<Users size={150} strokeWidth={0.9} /> Opptaksstatus
									</Box>
									{isTheOrganizer && (
										<Box
											className={classes.metroBoxes}
											onClick={() => navigate('/admission-period')}
										>
											<CalendarEvent size={150} strokeWidth={0.9} /> Opptaksperiode
										</Box>
									)}
								</div>
								{isTheOrganizer && (
									<Button
										onClick={() => setWipeModalOpen(true)}
										className={classes.wipeDataButton}
										leftIcon={<Trash size={18} />}
									>
										Slett opptaksdata
									</Button>
								)}
							</>
						)}
					</Transition>
				)}
			</Box>
		</>
	)
}

export default Dashboard
