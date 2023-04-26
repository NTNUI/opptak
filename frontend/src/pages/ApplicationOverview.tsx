import { createStyles, Loader, Pagination } from '@mantine/core'
import { createContext, useEffect, useState } from 'react'
import ApplicationList from '../components/ApplicationList'
import Filter from '../components/FilterSearch'
import { IApplication } from '../types/types'
import { getApplications } from '../services/Applications'
import { useNavigate } from 'react-router-dom'
import useStickyState from '../utils/sessionstorage'
import { getUserCommittees, IRoleInCommittee } from '../services/User'
import {
	REACT_APP_ELECTION_COMMITTEE_ID,
	REACT_APP_MAIN_BOARD_ID,
} from '../utils/constants'

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
}))
export const UserContext = createContext<IUserContext>({
	userRoleInCommittees: [],
	isInElectionCommittee: false,
	isInMainBoard: false,
})

export const FilterContext = createContext<IFilterContext>({
	chosenCommittees: [],
})

interface IFilterContext {
	chosenCommittees: number[]
}
interface IUserContext {
	userRoleInCommittees: IRoleInCommittee[]
	isInElectionCommittee: boolean
	isInMainBoard: boolean
}

function ApplicationOverview() {
	const [currentPage, setCurrentPage] = useStickyState(1, 'page')
	const [numberOfPages, setNumberOfPages] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	const [applications, setApplications] = useState<IApplication[]>([])
	const [filters, setFilters] = useStickyState('sort=date_desc', 'filters')
	const [chosenCommittees, setChosenCommittees] = useStickyState(
		[''],
		'chosenCommittees'
	)
	const [sort, setSort] = useStickyState('date_desc', 'sort')
	const [status, setStatus] = useStickyState('', 'status')
	const [nameSearch, setNameSearch] = useStickyState('', 'nameSearch')

	const [userRoleInCommittees, setUserRoleInCommittees] = useState<
		IRoleInCommittee[]
	>([])

	let navigate = useNavigate()

	const { classes } = useStyles()

	useEffect(() => {
		const userCommitteesRes = async () => {
			try {
				const userCommitteesRes = await getUserCommittees()
				setUserRoleInCommittees(userCommitteesRes)
				// Pre-select committee in filter if user is only in one committee
				const isUserInElectionCommitteeOrMainBoard = userCommitteesRes.some(
					(roleInCommittee) =>
						roleInCommittee.committee._id === REACT_APP_ELECTION_COMMITTEE_ID ||
						roleInCommittee.committee._id === REACT_APP_MAIN_BOARD_ID
				)
				const isUserInOneCommittee = userCommitteesRes.length === 1
				const isCommitteeCached =
					chosenCommittees.length === 1 &&
					chosenCommittees[0].toString().length !== 0
				if (
					!isUserInElectionCommitteeOrMainBoard &&
					isUserInOneCommittee &&
					!isCommitteeCached
				) {
					setChosenCommittees(
						userCommitteesRes.map((roleInCommittee) =>
							roleInCommittee.committee._id.toString()
						)
					)
				}
			} catch (error: any) {
				setIsLoading(false)
				if (error.response.status !== 200) {
					navigate('/login')
				}
			}
		}
		userCommitteesRes()
	}, [])

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
			<UserContext.Provider
				value={{
					userRoleInCommittees,
					isInElectionCommittee: userRoleInCommittees.some(
						(roleInCommittee) =>
							roleInCommittee.committee._id === REACT_APP_ELECTION_COMMITTEE_ID
					),
					isInMainBoard: userRoleInCommittees.some(
						(roleInCommittee) =>
							roleInCommittee.committee._id === REACT_APP_MAIN_BOARD_ID
					),
				}}
			>
				<Filter
					setFilter={setFilters}
					chosenCommittees={chosenCommittees}
					setChosenCommittees={setChosenCommittees}
					sort={sort}
					setSort={setSort}
					status={status}
					setStatus={setStatus}
					nameSearch={nameSearch}
					setNameSearch={setNameSearch}
				/>
				{isLoading ? (
					<Loader color='yellow' />
				) : applications.length ? (
					<FilterContext.Provider value={{ chosenCommittees }}>
						<ApplicationList applications={applications} />
					</FilterContext.Provider>
				) : (
					<span>No applications found</span>
				)}
			</UserContext.Provider>
			<Pagination
				className={classes.pagination}
				classNames={{
					item: classes.paginationItems,
				}}
				total={numberOfPages}
				noWrap
				disabled={applications.length === 0}
				page={currentPage}
				onChange={setCurrentPage}
			/>
		</div>
	)
}

export default ApplicationOverview
