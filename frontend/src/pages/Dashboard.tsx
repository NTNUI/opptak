import { Box, createStyles, Loader } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarEvent, FileText, Users } from 'tabler-icons-react'
import {
	isApplicationPeriodActive,
	getAdmissionPeriod,
} from '../services/Applications'
import isOrganizer from '../utils/isOrganizer'
import { getNtnuiProfile } from '../../../package/index'

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
		fontWeight: '600',
	},
	loader: {
		margin: '0 0 -3px 0',
	},
}))

function Dashboard() {
	const { classes } = useStyles()
	const navigate = useNavigate()
	const [periodOpen, setPeriodOpen] = useState<boolean>(false)
	const [startDate, setStartDate] = useState<string>('')
	const [endDate, setEndDate] = useState<string>('')
	const [isTheOrganizer, setTheOrganizer] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	useEffect(() => {
		setIsLoading(true)
		const getApplicationPeriodActiveAsync = async () => {
			try {
				if (await isOrganizer()) {
					setTheOrganizer(true)
				}
				const response = await isApplicationPeriodActive()
				setPeriodOpen(response)
				if (response) {
					const getApplicationsPeriodAsync = async () => {
						const response = await getAdmissionPeriod()
						const parsedEndDate = new Date(
							response.admissionPeriod.end_date
						).toLocaleDateString('no-No', {
							month: 'long',
							day: '2-digit',
							year: 'numeric',
						})
						const parsedStartDate = new Date(
							response.admissionPeriod.start_date
						).toLocaleDateString('no-No', {
							month: 'long',
							day: '2-digit',
							year: 'numeric',
						})
						setStartDate(parsedStartDate)
						setEndDate(parsedEndDate)
						setIsLoading(false)
					}
					getApplicationsPeriodAsync()
				}
			} catch (err) {
				setPeriodOpen(false)
			}
		}
		getApplicationPeriodActiveAsync()
	}, [])

	return (
		<Box className={classes.dashboardWrapper}>
			<h1 className={classes.text}>
				Hei, <span className={classes.header}>Bolle Bollesen!</span>
			</h1>
			{periodOpen ? (
				<p className={classes.text}>
					<CalendarEvent size={24} strokeWidth={1.5} /> Opptaksperioden er satt fra{' '}
					{isLoading ? (
						<Loader className={classes.loader} color='blue' variant='dots' />
					) : (
						<span className={classes.date}>{startDate}</span>
					)}{' '}
					til{' '}
					{isLoading ? (
						<Loader className={classes.loader} color='blue' variant='dots' />
					) : (
						<span className={classes.date}>{endDate}</span>
					)}
				</p>
			) : (
				<p className={classes.text}>Det er for tiden ingen satt opptaksperiode</p>
			)}
			<div className={classes.metroBoxWrapper}>
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
		</Box>
	)
}

export default Dashboard
