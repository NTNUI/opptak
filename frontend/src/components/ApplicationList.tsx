import { Container, createStyles, Pagination } from '@mantine/core'
import ApplicationItem from './ApplicationItem'
import { IApplication } from '../types/application'
import { useEffect, useState } from 'react'
import axios from 'axios'

const useStyles = createStyles((theme) => ({
	container: {
		width: '100%',
		display: 'flex',
		padding: '0',
		paddingBottom: '2rem',
		flexDirection: 'column',
		gap: '1rem',
		margin: 'auto',
	},
	pagination: {
		paddingTop: '1rem',
		paddingBottom: '1rem',
		margin: 'auto',
		active: { color: 'red' },
	},
	pagintaionItems: {
		color: 'white',
		border: theme.colors.ntnui_background[9],
		backgroundColor: theme.colors.ntnui_background[9],
	},
	paginationDots: {},
	pagintationActive: {
		backgroundColor: theme.colors.ntnui_blue[9],
	},
}))

function ApplicationList() {
	const [applications, setApplications] = useState<IApplication[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [numberOfPages, setNumberOfPages] = useState(1)

	useEffect(() => {
		axios
			.get(`http://localhost:8082/applications/?page=${currentPage}`)
			.then((res) => {
				setApplications(res.data.applications)
				setCurrentPage(res.data.currentPage)
				setNumberOfPages(res.data.numberOfPages)
			})
			.catch((err) => console.log(err))
	}, [currentPage])

	const { classes } = useStyles()
	return (
		<Container className={classes.container}>
			{applications
				? applications.map((item: IApplication, idx: number) => (
						<ApplicationItem key={idx} {...item} />
				  ))
				: 'No applications found'}
			<Pagination
				className={classes.pagination}
				classNames={{
					item: classes.pagintaionItems,
					dots: classes.paginationDots,
					active: classes.pagintationActive,
				}}
				total={numberOfPages}
				page={currentPage}
				onChange={setCurrentPage}
			/>
		</Container>
	)
}

export default ApplicationList
