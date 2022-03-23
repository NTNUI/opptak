import { Box, Button, createStyles, Loader } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
	AlertTriangle,
	AlignJustified,
	ArrowLeft,
	ClipboardList,
	Mail,
	Phone,
	User,
} from 'tabler-icons-react'
import { getApplication } from '../services/Applications'
import { IApplication } from '../types/types'

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
	errorMessage: {
		color: theme.colors.ntnui_red[9],
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		h1: {
			fontWeight: 'lighter',
			fontSize: 'x-large',
		},
		svg: {
			color: theme.colors.ntnui_red[9],
			margin: '0 5px 0 0',
		},
	},
}))

function YellowDotLoader() {
	return <Loader color='yellow' variant='dots' />
}

function ApplicationDetailPage() {
	const { classes } = useStyles()
	const navigate = useNavigate()
	const [application, setApplication] = useState<IApplication | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isError, setIsError] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState('')
	const { id } = useParams()

	useEffect(() => {
		setIsLoading(true)
		if (id) {
			const getApplicationAsync = async () => {
				try {
					const response = await getApplication(id)
					setApplication(response.application)
					setIsLoading(false)
				} catch (error: any) {
					setIsLoading(false)
					if (error.response.status === 403) {
						setIsError(true)
						setErrorMessage('Du har ikke tilgang til denne søknaden')
					} else if (error.response.status === 404) {
						setIsError(true)
						setErrorMessage('Kunne ikke finne søknaden')
					} else {
						navigate('/login')
					}
				}
			}
			getApplicationAsync()
		}
	}, [id, navigate])

	return (
		<>
			{!isError ? (
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
							<>Søknad fra </>
							<b>
								{isLoading || !application ? <YellowDotLoader /> : application.name}
							</b>
						</h1>
					</div>
					<Box className={classes.pageWrapper}>
						<Box className={classes.personalInfo}>
							<h2 className={classes.formTitle}>
								<ClipboardList size={32} /> Personinformasjon
							</h2>
							<p>
								<User size={24} /> <b>Navn:</b>{' '}
								{isLoading || !application ? <YellowDotLoader /> : application.name}
							</p>
							<p>
								<Phone size={24} /> <b>Telefon:</b>{' '}
								{isLoading || !application ? (
									<YellowDotLoader />
								) : (
									application.phone_number
								)}
							</p>
							<p>
								<Mail size={24} /> <b>E-post:</b>{' '}
								{isLoading || !application ? <YellowDotLoader /> : application.email}
							</p>
						</Box>
						<Box className={classes.applicationText}>
							<h2 className={classes.formTitle}>
								<AlignJustified size={32} /> Søknadstekst
							</h2>
							<p>
								{isLoading || !application ? <YellowDotLoader /> : application.text}
							</p>
						</Box>
					</Box>
				</>
			) : (
				<div className={classes.errorMessage}>
					<AlertTriangle size={35} />
					<h1>{errorMessage}</h1>
				</div>
			)}
		</>
	)
}

export default ApplicationDetailPage
