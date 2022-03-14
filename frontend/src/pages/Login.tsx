import { Button, createStyles } from '@mantine/core'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'tabler-icons-react'
import LoginForm from '../components/LoginForm'

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
		'@media (max-width: 600px)': {
			fontSize: 'small',
			width: '90%',
		},
		'@media (min-width: 600px)': {
			width: '50%',
		},
		'@media (min-width: 900px)': {
			width: '25%',
		},
	},
}))

function Login() {
	const { classes } = useStyles()
	const navigate = useNavigate()

	useEffect(() => {
		axios
			.post('/auth/verify')
			.then((res) => {
				navigate('/applications') // TODO: redirect to dashboard
			})
			.catch(() => console.log('was not authed')) // TODO: catch properly
	}, [navigate])

	return (
		<div className={classes.pageWrapper}>
			<Button
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
