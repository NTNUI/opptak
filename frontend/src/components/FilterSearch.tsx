import { createStyles, Group, Input, MultiSelect, Select } from '@mantine/core'
import { forwardRef, useEffect, useState } from 'react'
import {
	ChevronDown,
	Database,
	QuestionMark,
	Search,
	X,
} from 'tabler-icons-react'
import { getAllCommittees } from '../services/Committees'
import { ICommittee } from '../types/types'
import StatusTypes from '../utils/enums'
import {
	getIconForStatus,
	getStatus,
	getStatusTranslation,
} from '../utils/status'

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
	statusTypesArray.unshift({ label: 'Alle', value: 'all' })
	return statusTypesArray
}

function FilterSearch() {
	const { classes } = useStyles()
	const [committees, setCommittees] = useState<ICommittee[]>([])
	const [chosenCommittees, setChosenCommittees] = useState<string[]>([])
	const [status, setStatus] = useState<string>()
	const [dateSort, setDateSort] = useState<string>()

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

	// Convert list of ICommittee to list of strings
	const committeesToStrings = (committees: ICommittee[]) => {
		return committees.map((committee: ICommittee) => {
			return committee.name
		})
	}

	interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
		label: string
		value: StatusTypes
	}

	const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
		({ label, value, ...others }: ItemProps, ref) => (
			<div ref={ref} {...others}>
				<Group noWrap>
					{getStatusIcon(value)}
					{label}
				</Group>
			</div>
		)
	)

	function getStatusIcon(status: string) {
		const retreivedStatus = getStatus(status)

		try {
			if (retreivedStatus === undefined) {
				return <Database />
			} else {
				return getIconForStatus(retreivedStatus)
			}
		} catch (error) {
			return <QuestionMark />
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
					// @ts-expect-error
					icon={getStatusIcon(status)}
					label={<span className={classes.badgeLabel}>Velg status</span>}
					defaultValue={'all'}
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
						{ value: 'nyeste først', label: 'Nyeste først', group: 'Dato' },
						{ value: 'eldste først', label: 'Eldste først', group: 'Dato' },
						{ value: 'A-Å', label: 'A-Å', group: 'Alfabetisk' },
						{ value: 'Å-A', label: 'Å-A', group: 'Alfabetisk' },
					]}
					label={<span className={classes.badgeLabel}>Sorter etter</span>}
					defaultValue={'nyeste først'}
					size='sm'
					value={dateSort}
					onChange={(e) => setDateSort(e as string)}
					rightSection={<ChevronDown size={14} />}
					rightSectionWidth={40}
				/>
				<MultiSelect
					classNames={{
						root: classes.multiselectRoot,
						input: classes.multiselectInput,
						value: classes.multiselectValue,
					}}
					data={committeesToStrings(committees)}
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
