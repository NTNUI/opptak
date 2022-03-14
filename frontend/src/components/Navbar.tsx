import { Button } from '@mantine/core'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
	const navigate = useNavigate()

	const logOut = async () => {
		await axios
			.post('/auth/logout')
			.then(() => {
				navigate('/login')
			})
			.catch((err) => {
				console.log('Logout failed')
				console.log(err)
			})
	}

	return (
		<nav>
			<ul>
				<li>
					<Link to='/'>Form</Link>
				</li>
				<li>
					<Link to='/applications'>Applications</Link>
				</li>
				<li>
					<Button onClick={logOut}>Logg ut</Button>
				</li>
			</ul>
		</nav>
	)
}

export default Navbar
