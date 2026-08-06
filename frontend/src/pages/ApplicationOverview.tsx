import { createStyles, Loader, Pagination } from '@mantine/core'
import { createContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import ApplicationList from '../components/ApplicationList'
import Filter from '../components/FilterSearch'
import { getApplications } from '../services/Applications'
import { getUserCommittees, IRoleInCommittee } from '../services/User'
import { IApplication } from '../types/types'
import {
	REACT_APP_ELECTION_COMMITTEE_ID,
	REACT_APP_MAIN_BOARD_ID,
	REACT_APP_STUDENTLEKENE_ID,
} from '../utils/constants'
import useStickyState from '../utils/sessionstorage'

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

// Behold eksisterende useStyles her

interface IFilterContext {
	chosenCommittees: string[]
}

interface IUserContext {
	userRoleInCommittees: IRoleInCommittee[]
	isInElectionCommittee: boolean
	isInMainBoard: boolean
	isInSLBoard: boolean
}

interface ApplicationOverviewProps {
	isSL?: boolean
}

export const UserContext = createContext<IUserContext>({
	userRoleInCommittees: [],
	isInElectionCommittee: false,
	isInMainBoard: false,
	isInSLBoard: false,
})

export const FilterContext = createContext<IFilterContext>({
	chosenCommittees: [],
})

function ApplicationOverview({ isSL = false }: ApplicationOverviewProps) {
	const navigate = useNavigate()
	const { classes } = useStyles()

	/*
	 * Komponenten avgjør selv om dette er SL-siden.
	 * Du trenger derfor ikke en isSL-prop.
	 */
	const [numberOfPages, setNumberOfPages] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	const [applications, setApplications] = useState<IApplication[]>([])
	const [userRoleInCommittees, setUserRoleInCommittees] = useState<
		IRoleInCommittee[]
	>([])

	/*
	 * Vanlig opptak og SL-opptak må ha forskjellige sessionStorage-nøkler.
	 */
	const [currentPage, setCurrentPage] = useStickyState(
		1,
		isSL ? 'slPage' : 'page'
	)

	const [filters, setFilters] = useStickyState(
		'sort=date_desc',
		isSL ? 'slFilters' : 'filters'
	)

	const [chosenCommittees, setChosenCommittees] = useStickyState(
		[''],
		isSL ? 'slChosenCommittees' : 'chosenCommittees'
	)

	const [sort, setSort] = useStickyState('date_desc', isSL ? 'slSort' : 'sort')

	const [status, setStatus] = useStickyState('', isSL ? 'slStatus' : 'status')

	const [nameSearch, setNameSearch] = useStickyState(
		'',
		isSL ? 'slNameSearch' : 'nameSearch'
	)

	const isInElectionCommittee = userRoleInCommittees.some(
		(roleInCommittee) =>
			roleInCommittee.committee._id === REACT_APP_ELECTION_COMMITTEE_ID
	)

	const isInMainBoard = userRoleInCommittees.some(
		(roleInCommittee) => roleInCommittee.committee._id === REACT_APP_MAIN_BOARD_ID
	)

	const isInSLBoard = userRoleInCommittees.some(
		(roleInCommittee) =>
			roleInCommittee.committee._id === REACT_APP_STUDENTLEKENE_ID
	)

	useEffect(() => {
		async function loadUserCommittees() {
			try {
				const response = await getUserCommittees()

				setUserRoleInCommittees(response)

				const userIsInElectionCommittee = response.some(
					(roleInCommittee) =>
						roleInCommittee.committee._id === REACT_APP_ELECTION_COMMITTEE_ID
				)

				const userIsInMainBoard = response.some(
					(roleInCommittee) =>
						roleInCommittee.committee._id === REACT_APP_MAIN_BOARD_ID
				)

				const userIsInSLBoard = response.some(
					(roleInCommittee) =>
						roleInCommittee.committee._id === REACT_APP_STUDENTLEKENE_ID
				)

				/*
				 * På SL-siden vurderer vi bare brukerens SL-komiteer
				 * når vi eventuelt forhåndsvelger én komité.
				 */
				const relevantUserCommittees = isSL
					? response.filter(
							(roleInCommittee) => roleInCommittee.committee.sl === true
					  )
					: response

				const hasBroadAccess =
					userIsInElectionCommittee || userIsInMainBoard || (isSL && userIsInSLBoard)

				const hasCachedCommittee =
					chosenCommittees.length === 1 && chosenCommittees[0].length > 0

				if (
					!hasBroadAccess &&
					relevantUserCommittees.length === 1 &&
					!hasCachedCommittee
				) {
					setChosenCommittees([relevantUserCommittees[0].committee._id.toString()])
				}
			} catch (error: any) {
				if (error.response?.status === 401) {
					navigate(isSL ? '/studentlekene/login' : '/login')
					return
				}

				console.error(
					'Could not retrieve user committees:',
					error.response?.data ?? error
				)
			}
		}

		loadUserCommittees()
	}, [isSL, navigate])

	useEffect(() => {
		async function loadApplications() {
			setIsLoading(true)

			try {
				const safePage = Math.max(1, Number(currentPage) || 1)

				const query = [isSL ? 'sl=true' : '', `page=${safePage}`, filters]
					.filter(Boolean)
					.join('&')

				const response = await getApplications(query)

				setApplications(response.applications)

				setCurrentPage(response.pagination.currentPage || 1)

				setNumberOfPages(Math.max(1, response.pagination.numberOfPages))
			} catch (error: any) {
				if (error.response?.status === 401) {
					navigate(isSL ? '/studentlekene/login' : '/login')
					return
				}

				console.error(
					`Could not retrieve ${isSL ? 'SL ' : ''}applications:`,
					error.response?.data ?? error
				)
			} finally {
				setIsLoading(false)
			}
		}

		loadApplications()
	}, [currentPage, filters, isSL, navigate, setCurrentPage])

	return (
		<div className={classes.overview}>
			<h1>{isSL ? 'Søknadsoversikt for Studentlekene' : 'Søknadsoversikt'}</h1>

			<UserContext.Provider
				value={{
					userRoleInCommittees,
					isInElectionCommittee,
					isInMainBoard,
					isInSLBoard,
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
					isSL={isSL}
				/>

				{isLoading ? (
					<Loader color='yellow' />
				) : applications.length > 0 ? (
					<FilterContext.Provider value={{ chosenCommittees }}>
						<ApplicationList applications={applications} />
					</FilterContext.Provider>
				) : (
					<span>Ingen søknader funnet</span>
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
