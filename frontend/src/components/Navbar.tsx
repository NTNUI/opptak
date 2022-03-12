import { Link } from 'react-router-dom'

function Navbar() {
	return (
		<nav>
			<ul>
				<li>
					<Link to='/'>Dashboard</Link>
				</li>
				<li>
					<Link to='/pricing'>Pricing</Link>
				</li>
			</ul>
		</nav>
	)
}

export default Navbar
