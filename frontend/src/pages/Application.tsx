import { Box, Button, createStyles } from '@mantine/core'
import {
	AlertTriangle,
	ClipboardList,
	CursorText,
	Home,
	Login,
	Logout,
	Mail,
	Phone,
	User,
} from 'tabler-icons-react'

const application = {
		_id: '6234871c96f988e3595d1d49',
		name: 'Sander Arntzen',
		phone_number: '123456778',
		email: 'sander@arn.no',
		text: "I'm super sporty!",
		committees: [
			{
				_id: 2,
				name: 'Triatlon',
				slug: 'triatlon',
			},
			{
				_id: 2,
				name: 'Sprint',
				slug: 'sprint',
			},
		],
		submitted_date: '2022-03-18T13:20:28.742Z',
		__v: 0,
}

const useStyles = createStyles((theme) => ({
	warningBox: {
		width: '80%',
		justifyContent: 'center',
		margin: 'auto',
		border: '3px solid ' + theme.colors.ntnui_red[9],
		textAlign: 'left',
		background: 'rgba(255,0,0,0.1)',
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
		marginTop: '1rem',
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
	PersonalInformation: {
		justifyContent: 'center',
		margin: 'auto',
		marginTop: '1rem',
		marginLeft: '2rem',
		color: 'white',
		p: {
			display: 'flex',
			gap: '0.4rem',
		},
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
	applicationText: {
		justifyContent: 'center',
		margin: 'auto',
		marginTop: '1rem',
		marginLeft: '2rem',
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
	applicationInsideText: {
		justifyContent: 'center',
		margin: 'auto',
		marginTop: '1rem',
		marginLeft: '2rem',
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
	applicationHeader: {
		justifyContent: 'center',
		textAlign: 'center',
		fontWeight: 'lighter',
		margin: 'auto',
		marginBottom: '1rem',
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
		gap: '0.4rem',
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
		marginLeft: 'auto',
		fontWeight: 'normal',
		borderRadius: '5px 0 0 5px',
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
			<div></div>
			<h1 className={classes.applicationHeader}>Søknad fra {application.name}</h1>
			<Box className={classes.warningBox}>
				<h4 className={classes.formTitle}>
					<AlertTriangle size={40} />
					Har søkt {application.committees.map(committee => committee.name)}
				</h4>
			</Box>
			<Box className={classes.ApplicationBox}>
				<Box className={classes.PersonalInformation}>
					<h1 className={classes.formTitle}>
						<ClipboardList /> Personinformasjon
					</h1>
					<p>
						<User size={24} /> <b>Navn:</b> {application.name}
					</p>
					<p>
						<Phone size={24} /> <b>Telefon:</b> {application.phone_number}
					</p>
					<p>
						<Mail size={24} /> <b>E-post:</b> {application.email}
					</p>
				</Box>
				<Box className={classes.applicationText}>
					<h1 className={classes.formTitle}>
						<CursorText /> Søknadstekst
					</h1>
					<p>
						{application.text}
					</p>
				</Box>
			</Box>
		</>
	)
}

export default ApplicationBox
