import { ClassNames } from '@emotion/react'
import {
	ActionIcon,
	Badge,
	Collapse,
	createStyles,
	Input,
	MultiSelect,
	Select,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { Search, Adjustments, X } from 'tabler-icons-react'
import { getAllCommittees } from '../services/Committees'
import { ICommittee } from '../types/types'

const useStyles = createStyles((theme) => ({
	outerWrapper: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	filterWrapper: {
		//margin: '0rem auto 2rem',
		padding: '0',
		//width: '100%',
		display: 'flex',
		marginBottom: '1rem',
		//gap: '1rem',
		flexDirection: 'column',
		width: '60%',
		//alignContent: 'center',
		//justifyContent: 'center',
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
	searchWrapper: {
		display: 'flex',
		flexDirection: 'row',
		gap: '0.5rem',
		width: '100%',
		justifyContent: 'center',
		marginBottom: '1rem',
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
	actionIconRoot: {},
	actionIcon: {
		backgroundColor: theme.colors.ntnui_yellow[9],
		border: 'none',
		color: theme.colors.ntnui_background[9],
		width: '5rem',
		'&:hover': {
			backgroundColor: theme.colors.ntnui_yellow[9],
		},
	},
	collapse: {
		//backgroundColor: theme.colors.ntnui_yellow[9],
		//padding: '0.5rem',
	},
	selectLabel: {
		color: 'black',
	},
	selectSortingRoot: {
		marginBottom: 0,
	},
	multiselectInput: {
		background: 'transparent',
		color: 'white',
	},
	multiselectValue: {
		background: theme.colors.ntnui_yellow[9],
		color: theme.colors.ntnui_background[9],
	},
	selectInput: {
		background: 'transparent',
		color: 'white',
	},
	badgeLabel: {
		color: 'white',
	},
	collapseInner: {
		border: '2px solid' + theme.colors.ntnui_yellow[9],
		borderRadius: theme.radius.sm,
		padding: '1rem',
		display: 'grid',
		gap: '1rem',
		gridTemplateColumns: '1fr 1fr',
		marginBottom: '1rem',
	},
	filterPreview: {
		marginBottom: '1rem',
		display: 'grid',
		gap: '1rem',
		gridTemplateColumns: '3fr 1fr',
		'@media (max-width: 600px)': {
			width: '90%',
			display: 'flex',
			flexDirection: 'column',
			gap: '1rem',
			//alignItems: 'center',
		},
		'@media (min-width: 600px)': {
			width: '80%',
			gridTemplateColumns: '4fr 2fr',
		},
		'@media (min-width: 1200px)': {
			width: '70%',
			gridTemplateColumns: '3fr 1fr',
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
	// filterBadgeOutline: {
	// 	border: '2px solid' + theme.colors.ntnui_yellow[9],
	// },
}))

// const removeButton = (
// 	<ActionIcon size='xs' color='yellow' radius='xl' variant='transparent'>
// 		<X size={12} strokeWidth={3} />
// 	</ActionIcon>
// )

function FilterSearch() {
	const { classes } = useStyles()
	const [opened, setOpen] = useState(false)
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

	function FilterBadge(name: string, key: number) {
		return (
			<Badge
				classNames={{
					root: classes.filterBadgeRoot,
					//outline: classes.filterBadgeOutline,
					// inner: classes.filterBadgeInner,
				}}
				key={key}
				variant='outline'
				//sx={{ paddingRight: 3 }}
			>
				{name}
			</Badge>
		)
	}

	return (
		<>
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

					<ActionIcon
						classNames={{ root: classes.actionIconRoot, filled: classes.actionIcon }}
						variant='filled'
						size={42}
						onClick={() => setOpen((o) => !o)}
					>
						<Adjustments size={30} />
					</ActionIcon>
				</div>

				<Collapse className={classes.collapse} in={opened}>
					<div className={classes.collapseInner}>
						<MultiSelect
							classNames={{
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
						/>
						<Select
							classNames={{
								label: classes.selectLabel,
								input: classes.selectInput,
							}}
							data={['Alle', 'Akseptert', 'Innkalt', 'Ubehandlet', 'Avvist']}
							label={<span className={classes.badgeLabel}>Velg status</span>}
							defaultValue={'Alle'}
							value={status}
							onChange={(e) => setStatus(e as string)}
						/>
					</div>
				</Collapse>
			</div>
			<div className={classes.filterPreview}>
				<div className={classes.filterBadgesWrapper}>
					{chosenCommittees.map((committee: string, key: number) =>
						FilterBadge(committee, key)
					)}
				</div>
				<Select
					classNames={{
						root: classes.selectSortingRoot,
						label: classes.selectLabel,
						input: classes.selectInput,
					}}
					data={['Nyeste først', 'Eldste først']}
					//label={<span className={classes.badgeLabel}>Sorter etter</span>}
					//nothingFound='Nothing found'
					defaultValue={'Nyeste først'}
					size='sm'
					value={dateSort}
					onChange={(e) => setDateSort(e as string)}
				/>
			</div>
		</>
	)
}

export default FilterSearch
