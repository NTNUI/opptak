import { Box, Button, createStyles } from '@mantine/core'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
	AlignJustified,
	ArrowLeft,
	ClipboardList,
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
	pageWrapper: {
		boxSizing: 'border-box',
		width: '60%',
		margin: 'auto',
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
		color: 'white',
		padding: '3rem',
		'@media (max-width: 1200px)': {
			width: '70%',
		},
		'@media (max-width: 700px)': {
			width: '85%',
			border: 'none',
			backgroundColor: 'transparent',
			padding: '0',
		},
		display: 'flex',
		flexDirection: 'column',
		gap: '2rem',
	},
	pageHeader: {
		display: 'grid',
		width: '60%',
		margin: '1rem auto 1rem auto',
		gridTemplateColumns: '1fr 3fr 1fr',
		alignItems: 'center',
		'@media (max-width: 1200px)': {
			width: '70%',
			gridTemplateColumns: '1fr',
		},
		'@media (max-width: 700px)': {
			width: '85%',
			gridTemplateColumns: '1fr',
		},
	},
	backButton: {
		gridColumn: 1,
		justifySelf: 'start',
		padding: 0,
		background: 'transparent',
		color: 'white',
		transition: '0.3s',
		span: {
			margin: 0,
		},
		'&:hover': {
			background: 'transparent',
			transform: 'translateX(-0.2em)',
		},
		'@media (max-width: 1200px)': {
			display: 'none',
		},
	},
	headerText: {
		gridColumn: 2,
		textAlign: 'center',
		color: 'white',
		fontWeight: 'lighter',
		'@media (max-width: 1200px)': {
			fontSize: 'x-large',
			gridColumn: 1,
		},
	},
	personalInfo: {
		color: 'white',
		p: {
			display: 'flex',
			gap: '0.4rem',
			margin: '0 0 0.5rem 0',
		},
	},
	applicationText: {
		color: 'white',
		p: {
			// Adjusted for icons
			margin: '0 0 0 4px',
		},
	},
	formTitle: {
		margin: '0 0 1rem 0',
		fontWeight: 'lighter',
		display: 'flex',
		alignItems: 'center',
		'*': {
			// Icon
			margin: '-5px 0 0 0',
		},
		'@media (max-width: 700px)': {
			margin: '0 0 0.5rem 0',
			fontWeight: 'bold',
			fontSize: 'large',
		},
	},
}))

function ApplicationDetailPage() {
	const { classes } = useStyles()
	const navigate = useNavigate()
	const { id } = useParams()

	useEffect(() => {
		// TODO: Load application details from endpoint
		console.log(id)
	}, [id])

	return (
		<>
			<div className={classes.pageHeader}>
				<Button
					onClick={() => navigate('/applications')}
					size='md'
					variant='subtle'
					className={classes.backButton}
					leftIcon={<ArrowLeft size={50} />}
				>
					Tilbake
				</Button>
				<h1 className={classes.headerText}>
					Søknad fra <b>Bolle {application.name}</b>
				</h1>
			</div>
			<Box className={classes.pageWrapper}>
				<Box className={classes.personalInfo}>
					<h2 className={classes.formTitle}>
						<ClipboardList size={32} /> Personinformasjon
					</h2>
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
					<h2 className={classes.formTitle}>
						<AlignJustified size={32} /> Søknadstekst
					</h2>
					<p>{application.text}</p>
				</Box>
			</Box>
		</>
	)
}

export default ApplicationDetailPage
