import { Box, Button, createStyles } from '@mantine/core'
import {
	AlertTriangle,
	FileText,
	Home,
	Login,
	Logout,
} from 'tabler-icons-react'
import { Form } from '../components/ApplicationForm'

const useStyles = createStyles((theme) => ({
	warningBox: {
		width: '80%',
		justifyContent: 'center',
		margin: 'auto',
		border: '3px solid ' + theme.colors.ntnui_red[9],
		textAlign: 'left',
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
    headerBox: {
		width: '80%',
		justifyContent: 'center',
		margin: 'auto',
		border: '3px solid ' + theme.colors.ntnui_red[9],
		textAlign: 'left',
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
	ApplicationBox: {
		width: '80%',
		justifyContent: 'center',
		margin: 'auto',
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
		textAlign: 'left',
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
	header: {
		width: 'auto',
		margin: '2rem 0',
		display: 'flex',
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
		textAlign: 'left',
		margin: '1.5rem auto 0 auto',
		'*': {
			// Icon
			margin: '0 0 -3px 0',
		},
		'@media (max-width: 700px)': {
			fontSize: 'large',
			marginBottom: '1rem',
		},
	},
	logo: {
		gridColumn: 3,
		justifySelf: 'left',
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
	dashboard: {
		backgroundColor: 'blue',
        display: 'flex',
        justifyContent: 'flex-end',
		fontWeight: 'normal',
		borderRadius: '5px 0 0 5px',
		borderRight: '0',
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
    logout: {
		backgroundColor: 'blue',
        display: 'flex',
        justifyContent: 'space-between',
		fontWeight: 'normal',
		borderRadius: '5px 0 0 5px',
		borderRight: '0',
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
}))

function ApplicationBox() {
	const { classes } = useStyles()
	return (
		<>
			<Box className={classes.header}>
				<Box className={classes.logo}>
					<img alt='NTNUI logo' src='/images/ntnui.svg' />
					<h1>OPPTAK</h1>
				</Box>
				<Button uppercase className={classes.dashboard}>
					<Home size={20} />
					Dashboard
				</Button>
				<Button uppercase className={classes.logout}>
					<Logout size={20} />
					Logg ut
				</Button>
			</Box>
			<Box className={classes.warningBox}>
				<h4 className={classes.formTitle}>
					<AlertTriangle size={40} />
					Har søkt Sprint og Blits
				</h4>
				<p>Koordiner for å unngå å konkurrere internt</p>
			</Box>
            <Box className={classes.warningBox}>
				<h4 className={classes.formTitle}>
					<AlertTriangle size={40} />
					Har søkt Sprint og Blits
				</h4>
				<p>Koordiner for å unngå å konkurrere internt</p>
			</Box>
			<Box className={classes.ApplicationBox}></Box>
		</>
	)
}

export default ApplicationBox
