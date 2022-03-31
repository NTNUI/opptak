import { MediaQuery } from '@mantine/core'
import { Box, Button, createStyles, Loader } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
	AlertTriangle,
	AlignJustified,
	ArrowLeft,
	ClipboardList,
	Clock,
	Mail,
	Phone,
	User,
} from 'tabler-icons-react'
import { getApplication } from '../services/Applications'
import { IApplication, ICommittee } from '../types/types'

const useStyles = createStyles((theme) => ({
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
	banner: {
		boxSizing: 'border-box',
		backgroundColor: theme.colors.ntnui_red[9] + '1A',
		border: '2px solid ' + theme.colors.ntnui_red[9],
		borderRadius: theme.radius.sm,
		width: '60%',
		margin: 'auto auto 15px auto',
		padding: '0.7rem 0.5rem',
		color: 'white',
		display: 'grid',
		gridTemplateColumns: 'auto 1fr',
		gridTemplateRows: 'auto 1fr',
		gridTemplateAreas: `
			'icon title'
			'icon description'
		`,
		h3: {
			fontWeight: 'lighter',
			gridArea: 'title',
			margin: '0 0 0 10px',
		},
		p: {
			gridArea: 'description',
			margin: '0 0 0 10px',
		},
		svg: {
			gridArea: 'icon',
			alignSelf: 'center',
			color: theme.colors.ntnui_red[9],
			margin: '0 0 -7px 0',
		},
		'@media (max-width: 1200px)': {
			width: '70%',
		},
		'@media (max-width: 700px)': {
			width: '85%',
			padding: '5px',
			borderWidth: '2px 0 2px 0',
			'p, h3': {
				margin: '0',
			},
			h3: {
				overflow: 'hidden',
				whiteSpace: 'nowrap',
				textOverflow: 'ellipsis',
			},
			svg: {
				display: 'none',
			},
		},
	},
	pageWrapper: {
		boxSizing: 'border-box',
		width: '60%',
		margin: 'auto',
		padding: '3rem',
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
		color: 'white',
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
		borderRadius: theme.radius.sm,
	},
	personalInfoSection: {
		color: 'white',
	},
	personalInfoItem: {
		margin: '0.5rem 0',
		wordBreak: 'break-all',
		display: 'flex',
		alignItems: 'center',
		gap: '0.1rem',
		svg: {
			minWidth: '24px',
			alignSelf: 'start',
		},
		b: {
			whiteSpace: 'nowrap',
			justifySelf: 'end',
			margin: '0 0.3rem 0 0',
		},
		p: {
			margin: 0,
		},
	},
	email: {
		p: {
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			color: theme.colors.ntnui_blue[9],
			a: {
				color: theme.colors.ntnui_blue[9],
				textDecoration: 'none',
			},
			b: {
				color: 'white',
			},
		},
	},
	applicationTextSection: {
		color: 'white',
		p: {
			// Adjusted for icons
			margin: '0 0 0 4px',
		},
		backgroundColor: theme.colors.ntnui_yellow[9] + '0F',
		borderRadius: theme.radius.sm,
		padding: '1rem',
		'@media (max-width: 700px)': {
			backgroundColor: 'transparent',
			borderRadius: '0',
			padding: '0',
		},
	},
	sectionTitle: {
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
	return <Loader color='white' variant='dots' />
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

	function stringifyDate(date: Date) {
		return new Date(date).toLocaleString('no-NO', {
			month: 'long',
			day: '2-digit',
			hour: 'numeric',
			minute: 'numeric',
		})
	}

	function stringifyCommittees(
		committees: ICommittee[],
		maxNum: number
	): string {
		if (committees.length === 2 && maxNum === 1) {
			return `${committees[0].name} og ${committees.length - 1} annet utvalg`
		} else if (committees.length > maxNum) {
			return `${committees[0].name} og ${committees.length - 1} andre utvalg`
		}
		return committees
			.map((committee) => committee.name)
			.reduce((left, right, idx) =>
				idx === committees.length - 1 ? left + ' og ' + right : left + ', ' + right
			)
	}

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
					{application
						? application.committees.length > 1 && (
								<>
									<MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
										<Box className={classes.banner}>
											<AlertTriangle size={55} />
											<h3>{`Søker ${stringifyCommittees(application.committees, 4)}`}</h3>
											<p>Koordiner for å unngå å konkurrere internt</p>
										</Box>
									</MediaQuery>
									<MediaQuery largerThan='sm' styles={{ display: 'none' }}>
										<Box className={classes.banner}>
											<AlertTriangle size={55} />
											<h3>{`Søker ${stringifyCommittees(application.committees, 2)}`}</h3>
											<p>Koordiner for å unngå å konkurrere internt</p>
										</Box>
									</MediaQuery>
								</>
						  )
						: null}
					<Box className={classes.pageWrapper}>
						<Box className={classes.personalInfoSection}>
							<h2 className={classes.sectionTitle}>
								<ClipboardList size={32} /> Personinformasjon
							</h2>
							<p className={classes.personalInfoItem}>
								<User size={24} />
								<p>
									<b>Navn:</b>
									{isLoading || !application ? <YellowDotLoader /> : application.name}
								</p>
							</p>
							<p className={classes.personalInfoItem}>
								<Phone size={24} />
								<p>
									<b>Telefon:</b>
									{isLoading || !application ? (
										<YellowDotLoader />
									) : (
										application.phone_number
									)}
								</p>
							</p>
							<p className={`${classes.personalInfoItem} ${classes.email}`}>
								<Mail size={24} />
								<p>
									<b>E-post:</b>
									{isLoading || !application ? (
										<YellowDotLoader />
									) : (
										<a href={`mailto:${application.email}`}>{application.email}</a>
									)}
								</p>
							</p>
							<p className={classes.personalInfoItem}>
								<Clock size={24} />
								<p>
									<b>Sendt inn:</b>
									{isLoading || !application ? (
										<YellowDotLoader />
									) : (
										stringifyDate(application.submitted_date)
									)}
								</p>
							</p>
						</Box>
						<Box className={classes.applicationTextSection}>
							<h2 className={classes.sectionTitle}>
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
