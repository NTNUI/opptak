import { Box, Button, createStyles } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { CalendarEvent, FileText, Lock, Scale, Trash, Users } from 'tabler-icons-react'

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
	},
	metroBoxes: {
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
		cursor: 'pointer',
		'&:hover': {
			transform: 'translateY(-0.3rem)',
		},
		'&:active': {
			transform: 'scale(0.98)'
		}

	},
}))

function Dashboard() {
	const { classes } = useStyles()
	const navigate = useNavigate()

	return (
		<Box className={classes.dashboardWrapper}>
			<h1>Hei, Bolle Bollesen!</h1>
			<div className={classes.metroBoxWrapper}>
			<Box className={classes.metroBoxes} onClick={() => navigate('/applications')}>
				<FileText size={150} /> Søknader 
			</Box>
			<Box className={classes.metroBoxes} onClick={() => navigate('/admission-status')}>
				<Users size={150} /> Opptaksstatus
			</Box>
			<Box className={classes.metroBoxes} onClick={() => navigate('/application-period')}>
				<CalendarEvent size={150} /> Opptaksperiode
			</Box>
			<Box className={classes.metroBoxes} onClick={() => navigate('/application-period')}>
				<Lock size={150} /> Tilganger
			</Box>
			</div>
		</Box>
	)
}

export default Dashboard
