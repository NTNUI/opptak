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
	Gavel,
} from 'tabler-icons-react'
import CommitteBanner from '../components/CommitteeBanner'
import StatusInput from '../components/StatusInput'
import { getApplication } from '../services/Applications'
import { getUserCommittees, IRoleInCommittee } from '../services/Committees'
import { IApplication, IStatus } from '../types/types'
import { REACT_APP_MAIN_BOARD_ID } from '../utils/constants'

interface IStatusesStyleProps {
	amountOfStatuses: number
}

const useStyles = createStyles(
	(theme, { amountOfStatuses }: IStatusesStyleProps) => ({
		pageHeader: {
			display: 'grid',
			width: '60%',
			margin: '1rem auto 1rem auto',
			gridTemplateColumns: '1fr 3fr 1fr',
			alignItems: 'center',
			'@media (max-width: 1200px)': {
				width: '70%',
			},
			'@media (max-width: 900px)': {
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
			'@media (max-width: 900px)': {
				display: 'none',
			},
		},
		headerText: {
			gridColumn: 2,
			textAlign: 'center',
			color: 'white',
			fontWeight: 'lighter',
			'@media (max-width: 900px)': {
				fontSize: 'x-large',
				gridColumn: 1,
			},
		},
		pageWrapper: {
			boxSizing: 'border-box',
			width: '60%',
			margin: 'auto',
			padding: '3rem',
			border: '2px solid ' + theme.colors.ntnui_yellow[9],
			color: 'white',
			display: 'grid',
			gridTemplateColumns: '2fr 1fr',
			gridTemplateRows: 'auto 1fr',
			gridTemplateAreas:
				amountOfStatuses > 4
					? `
			"personalinfo status"
			"applicationtext status"
		`
					: `
			"personalinfo status"
			"applicationtext applicationtext"
		`,
			gap: '2rem',
			borderRadius: theme.radius.sm,
			'@media (max-width: 1200px)': {
				width: '70%',
			},
			'@media (max-width: 900px)': {
				gridTemplateColumns: '1fr',
				gridTemplateAreas: `
				"personalinfo"
				"status"
				"applicationtext"
			`,
				gap: '2rem',
			},
			'@media (max-width: 700px)': {
				width: '85%',
				border: 'none',
				backgroundColor: 'transparent',
				padding: '0',
			},
		},
		personalInfoSection: {
			color: 'white',
			gridArea: 'personalinfo',
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
		statusSection: {
			gridArea: 'status',

			'> div': {
				margin: '10px 0 0 0',
			},
		},
		applicationTextSection: {
			gridArea: 'applicationtext',
			alignSelf: 'start',
			display: 'flex',
			flexDirection: 'column',
			gap: '1rem',
		},
		applicationTextItem: {
			color: 'white',
			p: {
				// Adjusted for icons
				wordBreak: 'break-all',
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
	})
)

function YellowDotLoader() {
	return <Loader color='white' variant='dots' />
}

function ApplicationDetailPage() {
	const navigate = useNavigate()
	const [application, setApplication] = useState<IApplication | null>(null)
	const [amountOfStatuses, setAmountOfStatuses] = useState<number>(0)
	const [isToMainBoard, setIsToMainBoard] = useState<boolean>(false)
	const { classes } = useStyles({ amountOfStatuses })
	const [userCommitteeIds, setUserCommitteeIds] = useState<number[]>([])
	const [userCommittees, setUserCommittees] = useState<IRoleInCommittee[]>([])
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
					const userCommitteesRes = await getUserCommittees()
					setUserCommitteeIds(
						userCommitteesRes.map((committee) => committee.committee._id)
					)
					setUserCommittees(userCommitteesRes)
					setIsLoading(false)
					setAmountOfStatuses(response.application.statuses.length)
					setIsToMainBoard(
						response.application.committees.some((committee) => {
							return committee._id === REACT_APP_MAIN_BOARD_ID
						})
					)
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

	interface IStatusWithRelevancy {
		status: IStatus
		isRelevant: boolean
	}

	function statusByRelevancy(statuses: IStatus[]): IStatusWithRelevancy[] {
		const isUserInElectionCommittee = userCommittees.some(
			(roleInCommittee: IRoleInCommittee) => {
				return roleInCommittee.committee.slug === 'valgkomiteen'
			}
		)
		const statByRel = statuses
			.map((status) => {
				// If the status can be edited by the user, it should be shown on the top
				const isStatusForMainBoard = status.committee.name === 'Hovedstyret'
				if (
					userCommitteeIds.includes(status.committee._id) ||
					(isUserInElectionCommittee && isStatusForMainBoard)
				) {
					return { status, isRelevant: true }
				}
				return { status, isRelevant: false }
			})
			.sort((a, b) => {
				// Order alphabetically
				if (a.isRelevant === b.isRelevant) {
					return a.status.committee.name.localeCompare(b.status.committee.name)
				} else if (a.isRelevant) {
					return -1
				}
				return 1
			})
		return statByRel
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
								<CommitteBanner committees={application.committees} />
						  )
						: null}
					<Box className={classes.pageWrapper}>
						<Box className={classes.personalInfoSection}>
							<h2 className={classes.sectionTitle}>
								<ClipboardList size={32} /> Personinformasjon
							</h2>
							<div className={classes.personalInfoItem}>
								<User size={24} />
								<p>
									<b>Navn:</b>
									{isLoading || !application ? <YellowDotLoader /> : application.name}
								</p>
							</div>
							<div className={classes.personalInfoItem}>
								<Phone size={24} />
								<p>
									<b>Telefon:</b>
									{isLoading || !application ? (
										<YellowDotLoader />
									) : (
										application.phone_number
									)}
								</p>
							</div>
							<div className={`${classes.personalInfoItem} ${classes.email}`}>
								<Mail size={24} />
								<p>
									<b>E-post:</b>
									{isLoading || !application ? (
										<YellowDotLoader />
									) : (
										<a href={`mailto:${application.email}`}>{application.email}</a>
									)}
								</p>
							</div>
							<div className={classes.personalInfoItem}>
								<Clock size={24} />
								<p>
									<b>Sendt inn:</b>
									{isLoading || !application ? (
										<YellowDotLoader />
									) : (
										stringifyDate(application.submitted_date)
									)}
								</p>
							</div>
						</Box>
						<Box className={classes.statusSection}>
							<h2 className={classes.sectionTitle}>
								<Gavel size={32} /> Status
							</h2>
							{isLoading || !application ? (
								<YellowDotLoader />
							) : (
								statusByRelevancy(application.statuses).map((statusRel, index) => (
									<StatusInput
										allowedToChange={!!statusRel.isRelevant}
										key={index}
										{...statusRel.status}
									/>
								))
							)}
						</Box>
						<Box className={classes.applicationTextSection}>
							{!isLoading &&
								application &&
								!(isToMainBoard && application.committees.length === 1) && (
									<Box className={classes.applicationTextItem}>
										<h2 className={classes.sectionTitle}>
											<AlignJustified size={32} /> Søknadstekst
										</h2>
										{!application.text.length ? (
											<i>Ingen søknadstekst</i>
										) : (
											<p>{application.text}</p>
										)}
									</Box>
								)}
							{!isLoading && application && isToMainBoard && (
								<Box className={classes.applicationTextItem}>
									<h2 className={classes.sectionTitle}>
										<AlignJustified size={32} /> Søknadstekst til Hovedstyret
									</h2>
									{!application.main_board_text.length ? (
										<i>Ingen søknadstekst</i>
									) : (
										<p>{application.main_board_text}</p>
									)}
								</Box>
							)}
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
