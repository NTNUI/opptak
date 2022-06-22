import { createStyles, Loader, Pagination } from '@mantine/core'
import { useEffect, useState } from 'react'
import ApplicationList from '../components/ApplicationList'
import Filter from '../components/FilterSearch'
import { IApplication } from '../types/types'
import { getApplications } from '../services/Applications'
import { useNavigate } from 'react-router-dom'

const useStyles = createStyles((theme) => ({
	overview: {
		display: 'flex',
		alignItems: 'center',
		color: 'white',
		padding: '0',
		flexDirection: 'column',
		margin: 'auto',
		'@media (max-width: 500px)': {
			fontSize: 'small',
			width: '100%',
		},
		'@media (min-width: 500px)': {
			width: '80%',
		},
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
		},
	},
	pagintationActive: {
		backgroundColor: theme.colors.ntnui_blue[9],
		'&:hover': {
			backgroundColor: theme.colors.ntnui_blue[9],
		},
	},
}))

function ApplicationOverview() {
	const [currentPage, setCurrentPage] = useState(1)
	const [numberOfPages, setNumberOfPages] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	const [applications, setApplications] = useState<IApplication[]>([])
	const [filters, setFilters] = useState<string>('sort=date_desc')

	let navigate = useNavigate()

	const { classes } = useStyles()

	useEffect(() => {
		setIsLoading(true)
		const getApplicationsAsync = async () => {
			try {
				const response = await getApplications(`page=${currentPage}&${filters}`)
				setApplications(response.applications)
				setCurrentPage(response.pagination.currentPage)
				setNumberOfPages(response.pagination.numberOfPages)
				setIsLoading(false)
			} catch (error: any) {
				setIsLoading(false)
				if (error.response.status !== 200) {
					navigate('/login')
				}
			}
		}
		getApplicationsAsync()
	}, [currentPage, navigate, filters])

	return (
		<div className={classes.overview}>
			<h1>Søknadsoversikt</h1>
			<Filter setFilter={setFilters} />
			{applications.length ? (
				<ApplicationList applications={applications} />
			) : isLoading ? (
				<Loader color='yellow' />
			) : (
				<span>No applications found</span>
			)}

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
		</div>
	)
}

export default ApplicationOverview
