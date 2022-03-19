import { Button, createStyles } from '@mantine/core'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'tabler-icons-react'
import LoginForm from '../components/LoginForm'
import { verifyToken } from '../services/Auth'

const useStyles = createStyles((theme) => ({
	backButton: {
		padding: 0,
		background: 'transparent',
		color: 'white',
		transition: '0.3s',
		'&:hover': {
			background: 'transparent',
			transform: 'translateX(-0.2em)',
		},
	},
	logo: {
		width: '10rem',
	},
	opptakHeader: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		margin: '2rem 0 2rem 0',
		'*': {
			margin: 0,
			fontWeight: 'normal',
			color: 'white',
			textAlign: 'center',
		},
	},
	pageWrapper: {
		display: 'flex',
		flexDirection: 'column',
		margin: 'auto',
		width: '340px',
		'@media (max-width: 400px)': {
			fontSize: 'small',
			width: '90%',
		},
	},
}))

function Login() {
	const { classes } = useStyles()
	const navigate = useNavigate()

	useEffect(() => {
		const verifyTokenAsync = async () => {
			try {
				await verifyToken()
				navigate('/dashboard')
			} catch (error) {}
		}
		verifyTokenAsync()
	}, [navigate])

	const backToForm = () => {
		navigate('/')
	}

	return (
		<div className={classes.pageWrapper}>
			<Button
				onClick={backToForm}
				size='lg'
				variant='subtle'
				className={classes.backButton}
				leftIcon={<ArrowLeft size={50} />}
			>
				Tilbake til søknadssiden
			</Button>
			<div className={classes.opptakHeader}>
				<img className={classes.logo} alt='ntnui logo' src='/images/ntnui.svg' />
				<h3>OPPTAK</h3>
				<p>Internt system for styremedlemmer</p>
			</div>
			<LoginForm />
		</div>
	)
}

export default Login
