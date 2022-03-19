import {
	Box,
	Burger,
	Button,
	createStyles,
	MediaQuery,
	Menu,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	CalendarEvent,
	FileText,
	Home,
	Logout,
	Users,
} from 'tabler-icons-react'

const useStyles = createStyles((theme) => ({
	navbar: {
		margin: 0,
		height: '100%',
		display: 'grid',
		alignItems: 'center',
		gap: '10px',
		padding: '10px',
		gridTemplateColumns: 'auto 1fr auto auto',
		'@media (min-width: 700px)': {
			gridTemplateColumns: 'auto 1fr auto',
		},
	},
	logo: {
		gridColumn: 1,
		display: 'flex',
		alignItems: 'center',
		gap: '10px',
		cursor: 'pointer',
		img: {
			height: '2em',
		},
		h1: {
			color: 'white',
			fontWeight: 'lighter',
			margin: 0,
		},
	},
	dashboard: {
		gridColumn: 4,
		backgroundColor: theme.colors.ntnui_blue[9],
		border: '2px solid' + theme.colors.ntnui_blue[9],
		transition: '0.3s',
		':hover': {
			border: '2px solid' + theme.colors.ntnui_blue[9],
			color: theme.colors.ntnui_blue[9],
			backgroundColor: 'transparent',
		},
	},
	logout: {
		gridColumn: 5,
		backgroundColor: theme.colors.ntnui_red[9],
		transition: '0.3s',
		border: '2px solid' + theme.colors.ntnui_red[9],
		':hover': {
			border: '2px solid' + theme.colors.ntnui_red[9],
			color: theme.colors.ntnui_red[9],
			backgroundColor: 'transparent',
		},
	},
	menu: {
		gridColumn: 3,
	},
	menuItemBody: {
		color: 'white',
		fontWeight: 'bold',
		borderRadius: 0,
		padding: '20px',
		backgroundColor: theme.colors.ntnui_background[7],
	},
	menuBody: {
		backgroundColor: theme.colors.ntnui_background[7],
		width: '100vw',
		border: 'none',
		borderRadius: 0,
		padding: 0,
	},
	active: {
		pointerEvents: 'none',
		color: 'white',
		fontWeight: 'bold',
		backgroundColor: theme.colors.ntnui_blue[9] + '49',
	},
}))

function Navbar() {
	const { classes } = useStyles()
	const navigate = useNavigate()
	const location = useLocation()
	const [opened, handlers] = useDisclosure(false)

	const logOut = async () => {
		await axios
			.post('/auth/logout')
			.then(() => {
				navigate('/login')
			})
			.catch((err) => {
				console.log('Something went wrong while logging out')
				console.log(err)
				navigate('/login')
			})
	}

	const navigateLogo = () => {
		location.pathname !== '/dashboard' ? navigate('/dashboard') : navigate('/')
	}

	return (
		<nav className={classes.navbar}>
			<Box className={classes.logo} onClick={navigateLogo}>
				<img alt='NTNUI logo' src='/images/ntnui.svg' />
				<h1>OPPTAK</h1>
			</Box>
			<MediaQuery largerThan='xs' styles={{ display: 'none' }}>
				<Menu
					opened={opened}
					gutter={13}
					transition='scale-y'
					transitionDuration={100}
					transitionTimingFunction='ease'
					shadow='xl'
					onOpen={handlers.open}
					onClose={handlers.close}
					control={<Burger opened={opened} color='white' />}
					className={classes.menu}
					classNames={{
						body: classes.menuBody,
						item: classes.menuItemBody,
					}}
				>
					<Menu.Item
						icon={<Home size={18} />}
						className={
							location.pathname === '/dashboard'
								? classes.active
								: classes.menuItemBody
						}
						onClick={() => navigate('/dashboard')}
					>
						Dashbord
					</Menu.Item>
					<Menu.Item
						icon={<FileText size={18} />}
						className={
							location.pathname === '/applications'
								? classes.active
								: classes.menuItemBody
						}
						onClick={() => navigate('/applications')}
					>
						Søknader
					</Menu.Item>
					<Menu.Item
						icon={<Users size={18} />}
						className={
							location.pathname === '/admission-status'
								? classes.active
								: classes.menuItemBody
						}
						onClick={() => navigate('/admission-status')}
					>
						Opptaksstatus
					</Menu.Item>
					<Menu.Item
						icon={<CalendarEvent size={18} />}
						className={
							location.pathname === '/application-period'
								? classes.active
								: classes.menuItemBody
						}
						onClick={() => navigate('/application-period')}
					>
						Opptaksperiode
					</Menu.Item>
					<Menu.Item
						icon={<Logout size={18} />}
						onClick={logOut}
						className={classes.menuItemBody}
					>
						Logg ut
					</Menu.Item>
				</Menu>
			</MediaQuery>
			{location.pathname !== '/dashboard' && (
				<MediaQuery smallerThan='xs' styles={{ display: 'none' }}>
					<Button
						className={classes.dashboard}
						onClick={() => navigate('/dashboard')}
					>
						<Home size={18} /> Dashbord
					</Button>
				</MediaQuery>
			)}
			<MediaQuery smallerThan='xs' styles={{ display: 'none' }}>
				<Button className={classes.logout} onClick={logOut}>
					<Logout size={18} /> Logg ut
				</Button>
			</MediaQuery>
		</nav>
	)
}

export default Navbar
