import { Box, createStyles, Transition } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarEvent, FileText, Users } from 'tabler-icons-react'
import {
	isApplicationPeriodActive,
	getAdmissionPeriod,
} from '../services/Applications'
import isOrganizer from '../utils/isOrganizer'
import { IUserProfile, getUserProfile } from '../services/User'
import dayjs from 'dayjs'
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
		fontWeight: '600',
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
		fontWeight: '500',
	},
	subHeader: {
		fontWeight: 'lighter',
	},
	loader: {
		margin: '0 0 -3px 0',
	},
}))

function Dashboard() {
	const { classes } = useStyles()
	const navigate = useNavigate()
	const [periodOpen, setPeriodOpen] = useState<boolean>(true)
	const [startDate, setStartDate] = useState<string>('')
	const [endDate, setEndDate] = useState<string>('')
	const [isTheOrganizer, setTheOrganizer] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [userName, setUserName] = useState<IUserProfile>()

	useEffect(() => {
		setIsLoading(true)
		const getDashboardDataAsync = async () => {
			try {
				// Get user
				const user = await getUserProfile()
				setUserName(user)
				if (await isOrganizer()) {
					setTheOrganizer(true)
				}
				// Check if application period active
				const response = await isApplicationPeriodActive()
				setPeriodOpen(response)
				// If active, get application period
				if (response) {
					const response = await getAdmissionPeriod()
					const parsedStartDate = dayjs(response.admissionPeriod.start_date)
						.locale('nb')
						.format('D. MMMM YYYY')
					const parsedEndDate = dayjs(response.admissionPeriod.end_date)
						.locale('nb')
						.format('D. MMMM YYYY')
					setStartDate(parsedStartDate)
					setEndDate(parsedEndDate)
				}
				setIsLoading(false)
			} catch (err) {
				setIsLoading(false)
			}
		}
		getDashboardDataAsync()
	}, [])

	return (
		<Box className={classes.dashboardWrapper}>
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
							{periodOpen ? (
								<>
									<CalendarEvent size={24} strokeWidth={1.5} /> Opptaksperioden er satt
									fra <span className={classes.date}>{startDate}</span> til{' '}
									<span className={classes.date}>{endDate}</span>
								</>
							) : (
								<span>Det er for tiden ingen satt opptaksperiode</span>
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
					</>
				)}
			</Transition>
		</Box>
	)
}

export default Dashboard
