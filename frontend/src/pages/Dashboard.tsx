import { Box, Button, createStyles } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { CalendarEvent, FileText, Users } from 'tabler-icons-react'

const useStyles = createStyles((theme) => ({
	dashboardWrapper: {
		margin: 0,
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		color: 'white',
	},
}))

function Dashboard() {
	const { classes } = useStyles()
	const navigate = useNavigate()

	return (
		<Box className={classes.dashboardWrapper}>
			<h1>Hei, Bolle bollesen!</h1>
			<Button onClick={() => navigate('/applications')}>
				<FileText size={18} /> Søknader
			</Button>
			<Button onClick={() => navigate('/admission-status')}>
				<Users size={18} /> Opptaksstatus
			</Button>
			<Button onClick={() => navigate('/admission-period')}>
				<CalendarEvent size={18} /> Opptaksperiode
			</Button>
		</Box>
	)
}

export default Dashboard
