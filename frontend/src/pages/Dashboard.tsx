import { Box, createStyles } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarEvent, FileText, Lock, Users } from 'tabler-icons-react'
import { isApplicationPeriodActive, getAdmissionPeriod } from '../services/Applications'


const useStyles = createStyles((theme) => ({
	dashboardWrapper: {
		margin: 0,
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		color: 'white',
	},
	metroBoxWrapper: {
		margin: 0,
		height: '100%',
		display: 'flex',
		flexDirection:'row',
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
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: '1rem',
		padding: '1rem',
		cursor: 'pointer',
		'&:active': {
			transform: 'scale(0.98)'
		},
	},
	date: {
		color: 'royalblue',
	}
}))

function Dashboard() {
	const { classes } = useStyles()
	const navigate = useNavigate()
	const [periodOpen, setPeriodOpen] = useState<boolean>(false)
	const [startDate, setStartDate] = useState<string>("")
	const [endDate, setEndDate] = useState<string>("")
	
	useEffect(() => {
		const getApplicationPeriodActiveAsync = async () => {
			try {
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
							response.admissionPeriod.start_date).toLocaleDateString('no-No', {
							month: 'long',
							day: '2-digit',
							year: 'numeric',
						})
						setStartDate(parsedStartDate)
						setEndDate(parsedEndDate)
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
			<h1>Hei, Bolle Bollesen!</h1>
			{periodOpen ? (<p>Opptaksperioden er satt fra <span className={classes.date}>{startDate}</span> til <span className={classes.date}>{endDate}</span> </p>) : (<p>Det er for tiden ingen satt opptaksperiode</p>)}
			<div className={classes.metroBoxWrapper}>
			<Box className={classes.metroBoxes} onClick={() => navigate('/applications')}>
				<FileText size={150} strokeWidth={0.7} /> Søknader 
			</Box>
			<Box className={classes.metroBoxes} onClick={() => navigate('/admission-status')}>
				<Users size={150} strokeWidth={0.7} /> Opptaksstatus
			</Box>
			<Box className={classes.metroBoxes} onClick={() => navigate('/admission-period')}>
				<CalendarEvent size={150} strokeWidth={0.7} /> Opptaksperiode
			</Box>
			<Box className={classes.metroBoxes} onClick={() => navigate('/admission-period')}>
				<Lock size={150} strokeWidth={0.7} /> Tilganger
			</Box>
			</div>
		</Box>
	)
}

export default Dashboard

