import { Box, Button, createStyles, Loader } from '@mantine/core'
import { FileText, Login } from 'tabler-icons-react'
import { Form } from '../components/ApplicationForm'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAdmissionPeriod } from '../services/Applications'
import { AdmissionPeriodStatus } from '../utils/enums'

const useStyles = createStyles((theme) => ({
	formTitleAndBodyWrapper: {
		backgroundColor: 'transparent',
		width: '35%',
		justifyContent: 'center',
		margin: 'auto auto 2rem auto',
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
		boxShadow: '0rem 0rem 1rem 0.4rem ' + theme.colors.dark[7],
		borderRadius: '20px',
		textAlign: 'left',
		color: 'white',
		'@media (max-width: 1550px)': {
			width: '45%',
		},
		'@media (max-width: 1200px)': {
			width: '60%',
		},
		'@media (max-width: 900px)': {
			width: '70%',
		},
		'@media (max-width: 700px)': {
			width: '85%',
			border: 'none',
			backgroundColor: 'transparent',
			boxShadow: 'none',
			padding: '1rem',
		},
	},
	header: {
		width: 'auto',
		margin: '2rem 0',
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 3fr 1fr 1fr',
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
		textAlign: 'center',
		margin: '1.5rem auto 0 auto',
		'*': {
			// Icon
			margin: '0 0 -3px 0',
		},
		'@media (max-width: 700px)': {
			fontSize: 'x-large',
			marginBottom: '1rem',
		},
	},
	logo: {
		gridColumn: 3,
		justifySelf: 'center',
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
	internButton: {
		backgroundColor: 'transparent',
		justifySelf: 'end',
		fontWeight: 'normal',
		border: '2px solid' + theme.colors.ntnui_blue[9],
		borderRadius: '5px 0 0 5px',
		borderRight: '0',
		gridColumn: 5,
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
	closedPeriod: {
		width: '40%',
		margin: 'auto',
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
		borderRadius: theme.radius.sm,
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
	closedText: {
		textAlign: 'center',
		marginLeft: '1rem',
		marginRight: '1rem',
		'*': {
			// Icon
			margin: '0 0 -3px 0',
		},
		'@media (max-width: 700px)': {
			fontSize: 'medium',
			marginBottom: '1rem',
		},
		a: {
			color: theme.colors.ntnui_yellow[9],
		},
	},
	loading: {
		margin: 'auto',
		width: '100%',
	},
	endOfSearchPeriodText: {
		textAlign: 'center',
		fontSize: 'large',
		paddingBottom: '1rem',
	},
}))

function FormBox() {
	const { classes } = useStyles()
	const [periodStatus, setPeriodStatus] = useState<AdmissionPeriodStatus>(
		AdmissionPeriodStatus.open
	)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [startDate, setStartDate] = useState<string>('')
	const [endDate, setEndDate] = useState<string>('')
	let navigate = useNavigate()

	useEffect(() => {
		setIsLoading(true)
		const getApplicationPeriodActiveAsync = async () => {
			try {
				const response = await getAdmissionPeriod()
				const admissionPeriod = response.admissionPeriod

				setPeriodStatus(response.admissionStatus)
				if (response.admissionStatus === AdmissionPeriodStatus.open) {
					const parsedEndDate = new Date(admissionPeriod.end_date)
						.toLocaleDateString('no-No', {
							month: 'long',
							day: '2-digit',
							year: 'numeric',
						})
						.concat(' 23:59')
					setEndDate(parsedEndDate)
				} else if (response.admissionStatus === AdmissionPeriodStatus.upcoming) {
					const parsedStartDate = new Date(
						admissionPeriod.start_date
					).toLocaleDateString('no-No', {
						month: 'long',
						day: '2-digit',
						year: 'numeric',
					})
					setStartDate(parsedStartDate)
				}
			} catch (err) {
			} finally {
				setIsLoading(false)
			}
		}
		getApplicationPeriodActiveAsync()
	}, [])

	return (
		<>
			<Box className={classes.header}>
				<Box className={classes.logo}>
					<img alt='NTNUI logo' src='/images/ntnui.svg' />
					<h1>OPPTAK</h1>
				</Box>
				<Button
					onClick={() => navigate('/login')}
					uppercase
					className={classes.internButton}
				>
					<Login size={20} />
					Intern
				</Button>
			</Box>
			{isLoading ? (
				<Loader size='xl' color='yellow' className={classes.loading} />
			) : periodStatus === AdmissionPeriodStatus.open ? (
				<Box className={classes.formTitleAndBodyWrapper}>
					<h1 className={classes.formTitle}>
						<FileText />
						Søknad til NTNUI Admin
					</h1>
					{endDate && (
						<p className={classes.endOfSearchPeriodText}>Søknadsfrist: {endDate}</p>
					)}
					<Form />
				</Box>
			) : periodStatus === AdmissionPeriodStatus.upcoming ? (
				<Box className={classes.closedPeriod}>
					<h1 className={classes.formTitle}>
						Opptaket til NTNUI Admin starter {startDate}!
					</h1>
					<p className={classes.closedText}>
						<div className=''>
							Les mer om våre utvalg på <a href='https://ntnui.no/opptak/'>ntnui.no</a>
							!
						</div>
					</p>
				</Box>
			) : (
				<Box className={classes.closedPeriod}>
					<h1 className={classes.formTitle}>
						NTNUI Admin har for tiden ingen opptak
					</h1>
					<p className={classes.closedText}>
						Leter du etter opptak til en NTNUI gruppe eller et lag? Finn gruppens egen
						nettside på <a href='https://medlem.ntnui.no/groups'>medlem.ntnui.no</a>!
					</p>
				</Box>
			)}
		</>
	)
}
export default FormBox
