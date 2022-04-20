import { createStyles, Group, Input, MultiSelect, Select } from '@mantine/core'
import { forwardRef, useEffect, useState } from 'react'
import { ChevronDown, Menu2, Search } from 'tabler-icons-react'
import { getAllCommittees } from '../services/Committees'
import { ICommittee } from '../types/types'
import StatusTypes from '../utils/enums'
import { getIconForStatus, getStatusTranslation } from '../utils/status'

const useStyles = createStyles((theme) => ({
	filterWrapper: {
		padding: '0',
		display: 'flex',
		gap: '1rem',
		flexDirection: 'column',
		width: '100%',
		alignItems: 'center',
		marginBottom: '1rem',
	},
	searchWrapper: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		width: '60%',
		'@media (max-width: 600px)': {
			width: '80%',
		},
		'@media (min-width: 600px)': {
			width: '70%',
		},
		'@media (min-width: 1200px)': {
			width: '50%',
		},
	},
	searchInputRoot: {
		width: '100%',
	},
	searchInput: {
		border: '2px solid' + theme.colors.ntnui_yellow[9],
		backgroundColor: theme.colors.ntnui_background[9],
		borderRadius: theme.radius.sm,
	},
	searchInputField: {
		color: 'white',
		'&:focus': {
			border: '2px solid' + theme.colors.ntnui_yellow[9],
		},
	},
	withIcon: {
		color: 'white',
	},
	filter: {},
	selectLabel: {
		color: 'black',
	},
	selectSortingRoot: {},
	selectStatusRoot: {},
	multiselectInput: {
		background: 'transparent',
		color: 'white',
		//border: '1px solid' + theme.colors.ntnui_yellow[9],
	},
	multiselectValue: {
		background: theme.colors.ntnui_yellow[9],
		color: theme.colors.ntnui_background[9],
	},
	selectInput: {
		background: 'transparent',
		color: 'white',
		//border: '1px solid' + theme.colors.ntnui_yellow[9],
	},
	badgeLabel: {
		color: 'white',
	},
	filterPreview: {
		marginBottom: '1rem',
		display: 'grid',
		gap: '0.5rem',
		columnGap: '2rem',
		gridTemplateColumns: '1fr 1fr',
		'@media (max-width: 600px)': {
			width: '90%',
			display: 'flex',
			flexDirection: 'column',
			gap: '0.5rem',
		},
		'@media (min-width: 600px)': {
			width: '80%',
		},
		'@media (min-width: 1200px)': {
			width: '70%',
			columnGap: '4rem',
		},
	},
	filterBadgesWrapper: {
		display: 'flex',
		gap: '0.5rem',
		alignItems: 'center',
		flexWrap: 'wrap',
	},
	filterBadgeRoot: {
		color: theme.colors.ntnui_yellow[9],
		border: ' 1px solid' + theme.colors.ntnui_yellow[9],
	},
	multiselectRoot: {
		gridColumn: '1 / 3',
	},
	selectRightSection: {
		pointerEvents: 'none',
	},
}))

interface StatusTypesData {
	value: string
	label: string
}

function getStatusTypesStrings(): StatusTypesData[] {
	// .push({ label: 'Alle', value: 'all' })

	const statusTypesArray: StatusTypesData[] = Object.values(StatusTypes).map(
		(status: StatusTypes) => {
			return { label: getStatusTranslation(status), value: status }
		}
	)
	statusTypesArray.unshift({ label: 'Alle', value: '' })
	return statusTypesArray
}

type FilterSearchProps = {
	page: number
}

function FilterSearch(page: FilterSearchProps) {
	const { classes } = useStyles()
	const [committees, setCommittees] = useState<ICommittee[]>([])
	const [chosenCommittees, setChosenCommittees] = useState<string[]>([])
	const [status, setStatus] = useState<string>('')
	const [sort, setSort] = useState<string>('date_desc')
	const [nameSearch, setNameSearch] = useState<string>('')

	useEffect(() => {
		async function getCommittees() {
			try {
				let allCommittees: ICommittee[] = []
				allCommittees = await getAllCommittees()
				setCommittees(allCommittees)
			} catch (error: any) {}
		}
		getCommittees()
	}, [])

	useEffect(() => {
		function constructSearchFilterQuery() {
			let committeesFilterString = ''
			let statusString = ''
			let sortString = `sort=${sort}`
			let searchString = ''
			let pageString = `page=${page.page}`
			chosenCommittees.forEach((committee: string) => {
				committeesFilterString += `&committee=${committee}`
			})

			if (status !== '') {
				statusString = `status=${status}`
			}
			if (nameSearch !== '') {
				searchString = `name=${nameSearch}`
			}

			let searchQuery = new URLSearchParams(
				committeesFilterString +
					'&' +
					statusString +
					'&' +
					sortString +
					'&' +
					searchString +
					'&' +
					pageString
			)

			return searchQuery
		}
		constructSearchFilterQuery()
		// TODO: query backend with constructed search query
	}, [chosenCommittees, status, sort, nameSearch, page.page])

	function committeesToCommitteeData() {
		let dataList: { value: string; label: string }[] = []
		committees.forEach((committee: ICommittee) => {
			dataList.push({ value: `${committee._id}`, label: committee.name })
		})
		return dataList
	}

	interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
		label: string
		value: StatusTypes
	}

	const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
		({ label, value, ...others }: ItemProps, ref) => (
			<div ref={ref} {...others}>
				<Group noWrap>
					{getFilterStatusIcon(value)}
					{label}
				</Group>
			</div>
		)
	)

	function getFilterStatusIcon(status: string) {
		if (status === '') {
			return <Menu2 />
		} else {
			return getIconForStatus(status)
		}
	}

	return (
		<div className={classes.filterWrapper}>
			<div className={classes.searchWrapper}>
				<Input
					classNames={{
						wrapper: classes.searchInputRoot,
						defaultVariant: classes.searchInput,
						input: classes.searchInputField,
						withIcon: classes.withIcon,
					}}
					value={nameSearch}
					onChange={(e: any) => setNameSearch(e.target.value)}
					icon={<Search />}
					variant='default'
					placeholder='Søk etter søker ...'
					size='md'
				/>
			</div>
			<div className={classes.filterPreview}>
				<Select
					classNames={{
						root: classes.selectStatusRoot,
						label: classes.selectLabel,
						input: classes.selectInput,
						rightSection: classes.selectRightSection,
					}}
					data={getStatusTypesStrings()}
					itemComponent={SelectItem}
					icon={getFilterStatusIcon(status)}
					label={<span className={classes.badgeLabel}>Velg status</span>}
					defaultValue={''}
					value={status}
					onChange={(e) => setStatus(e as string)}
					rightSection={<ChevronDown size={14} />}
					rightSectionWidth={40}
				/>

				<Select
					classNames={{
						root: classes.selectSortingRoot,
						label: classes.selectLabel,
						input: classes.selectInput,
						rightSection: classes.selectRightSection,
					}}
					data={[
						{ value: 'date_desc', label: 'Nyeste først', group: 'Dato' },
						{ value: 'date_asc', label: 'Eldste først', group: 'Dato' },
						{ value: 'name_asc', label: 'A-Z', group: 'Alfabetisk' },
						{ value: 'name_desc', label: 'Z-A', group: 'Alfabetisk' },
					]}
					label={<span className={classes.badgeLabel}>Sorter etter</span>}
					defaultValue={'date_desc'}
					size='sm'
					value={sort}
					onChange={(e) => setSort(e as string)}
					rightSection={<ChevronDown size={14} />}
					rightSectionWidth={40}
				/>
				<MultiSelect
					classNames={{
						root: classes.multiselectRoot,
						input: classes.multiselectInput,
						value: classes.multiselectValue,
					}}
					data={committeesToCommitteeData()}
					label={<span className={classes.badgeLabel}>Velg utvalg</span>}
					placeholder='Velg utvalg'
					searchable
					clearable
					nothingFound='Nothing found'
					value={chosenCommittees}
					onChange={setChosenCommittees}
					rightSectionWidth={40}
				/>
			</div>
		</div>
	)
}

export default FilterSearch
