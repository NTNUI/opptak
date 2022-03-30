import { Box, Button, createStyles, Loader } from '@mantine/core'
import { FileText, Login } from 'tabler-icons-react'
import { Form } from '../components/ApplicationForm'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isApplicationPeriodActive } from '../services/Applications'

const useStyles = createStyles((theme) => ({
	formTitleAndBodyWrapper: {
		backgroundColor: 'transparent',
		width: '35%',
		justifyContent: 'center',
		margin: 'auto',
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
		borderRadius: '20px',
		textAlign: 'left',
		color: 'white',
		'@media (max-width: 1550px)': {
			width: '50%',
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
			fontSize: 'large',
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
		marginBottom: '1.5rem',
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
		'*': {
			// Icon
			margin: '0 0 -3px 0',
		},
		'@media (max-width: 700px)': {
			fontSize: 'large',
			marginBottom: '1rem',
		},
	},
	loading: {
		margin: 'auto',
		width: '100%',
	},
}))

function FormBox() {
	const { classes } = useStyles()
	const [periodOpen, setPeriodOpen] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	let navigate = useNavigate()

	useEffect(() => {
		setIsLoading(true)
		const getApplicationPeriodActiveAsync = async () => {
			try {
				const response = await isApplicationPeriodActive()
				setPeriodOpen(response)
				setIsLoading(false)
			} catch (err) {
				setPeriodOpen(false)
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
			) : periodOpen ? (
				<Box className={classes.formTitleAndBodyWrapper}>
					<h2 className={classes.formTitle}>
						<FileText />
						Søknad til NTNUI Admin
					</h2>
					<Form />
				</Box>
			) : (
				<Box className={classes.closedPeriod}>
					<h1 className={classes.formTitle}>Hei, kjære søker!</h1>
					<p className={classes.closedText}>
						Så gøy at du vil være en del av NTNUI. Opptaket er for tiden stengt, men
						gjerne sjekk igjen ved en senere anledning!
					</p>
				</Box>
			)}
		</>
	)
}
export default FormBox
