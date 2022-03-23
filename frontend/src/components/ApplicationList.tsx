import { Container, createStyles, Loader, Pagination } from '@mantine/core'
import ApplicationItem from './ApplicationItem'
import { IApplication } from '../types/types'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import getApplications from '../services/Applications'

const useStyles = createStyles((theme) => ({
	container: {
		display: 'flex',
		padding: '0',
		flexDirection: 'column',
		gap: '1rem',
	},
	pagination: {
		margin: '1rem auto 1rem auto',
		active: { color: 'red' },
	},
	paginationItems: {
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
		const getApplicationsAsync = async () => {
			try {
				const response = await getApplications(currentPage)
				setApplications(response.applications)
				setCurrentPage(response.currentPage)
				setNumberOfPages(response.numberOfPages)
				setIsLoading(false)
			} catch (error: any) {
				setIsLoading(false)
				if (error.response.status !== 200) {
					navigate('/login')
				}
			}
		}
		getApplicationsAsync()
	}, [currentPage, navigate])

	function itemClickHandler(id: string) {
		navigate(id)
	}

	const { classes } = useStyles()
	return applications.length ? (
		<Container className={classes.container}>
			{applications.map((item: IApplication, idx: number) => (
				<ApplicationItem key={idx} handleClick={itemClickHandler} {...item} />
			))}
			<Pagination
				className={classes.pagination}
				classNames={{
					item: classes.paginationItems,
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
