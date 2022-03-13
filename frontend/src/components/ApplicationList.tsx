import { Container, createStyles, Loader, Pagination } from '@mantine/core'
import ApplicationItem from './ApplicationItem'
import { IApplication } from '../types/types'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const useStyles = createStyles((theme) => ({
	container: {
		width: '100%',
		display: 'flex',
		padding: '0',
		flexDirection: 'column',
		gap: '1rem',
		margin: 'auto',
	},
	pagination: {
		margin: '1rem auto 1rem auto',
		active: { color: 'red' },
	},
	pagintaionItems: {
		color: 'white',
		border: theme.colors.ntnui_background[9],
		backgroundColor: theme.colors.ntnui_background[9],
		transition: 'ease-out 0.1s',
		'&:hover': {
			backgroundColor: theme.colors.ntnui_background[7],
			boxShadow: '0rem 0.2rem 0.4rem ' + theme.colors.dark[7],
			transform: 'translateY(-0.2em)',
		},
		'@media (max-width: 500px)': {
			fontSize: theme.fontSizes.md,
			minWidth: '1rem',
		},
	},
	pagintationActive: {
		backgroundColor: theme.colors.ntnui_blue[9],
		'&:hover': {
			backgroundColor: theme.colors.ntnui_blue[9],
		},
	},
}))

function ApplicationList() {
	const [applications, setApplications] = useState<IApplication[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [numberOfPages, setNumberOfPages] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	let navigate = useNavigate()

	useEffect(() => {
		setIsLoading(true)
		axios
			.get(`/applications/?page=${currentPage}`)
			.then((res) => {
				setApplications(res.data.applications)
				setCurrentPage(res.data.currentPage)
				setNumberOfPages(res.data.numberOfPages)
				setIsLoading(false)
			})
			.catch((err) => {
				setIsLoading(false)
				if (err.response.status === 401 || err.response.status === 403) {
					navigate('/login')
				}
				console.log(err)
			})
	}, [currentPage, navigate])

	const { classes } = useStyles()
	return applications.length ? (
		<Container className={classes.container}>
			{applications.map((item: IApplication, idx: number) => (
				<ApplicationItem key={idx} {...item} />
			))}
			<Pagination
				className={classes.pagination}
				classNames={{
					item: classes.pagintaionItems,
					active: classes.pagintationActive,
				}}
				total={numberOfPages}
				noWrap
				page={currentPage}
				onChange={setCurrentPage}
			/>
		</Container>
	) : isLoading ? (
		<Loader color='yellow' />
	) : (
		<span>No applications found</span>
	)
}

export default ApplicationList
