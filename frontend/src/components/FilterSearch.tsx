import {
	ActionIcon,
	Badge,
	Chip,
	Chips,
	Collapse,
	createStyles,
	Input,
	MultiSelect,
	NativeSelect,
	Select,
	Tooltip,
} from '@mantine/core'
import { useState } from 'react'
import {
	Search,
	Adjustments,
	AlertCircle,
	Circle,
	Check,
	LivePhoto,
	X,
} from 'tabler-icons-react'

const useStyles = createStyles((theme) => ({
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
	multiselectInput: {
		background: 'transparent',
		color: 'white',
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
		display: 'flex',
		flexDirection: 'row',
		gap: '0.5rem',
		width: '100%',
		justifyContent: 'center',
		marginBottom: '1rem',
	},
	filterChipsWrapper: {
		display: 'flex',
		gap: '0.5rem',
	},
}))

const removeButton = (
	<ActionIcon size='xs' color='yellow' radius='xl' variant='transparent'>
		<X size={12} strokeWidth={3} />
	</ActionIcon>
)

const filterBadge = (
	<>
		<Badge
			color='yellow'
			variant='outline'
			sx={{ paddingRight: 3 }}
			rightSection={removeButton}
		>
			Sprint
		</Badge>
		<Badge
			color='yellow'
			variant='outline'
			sx={{ paddingRight: 3 }}
			rightSection={removeButton}
		>
			Blits
		</Badge>
	</>
)

function FilterSearch() {
	const { classes } = useStyles()
	const [opened, setOpen] = useState(false)
	const [committees, setCommittees] = useState<string[]>([])
	const [status, setStatus] = useState<string>()
	const [dateSort, setDateSort] = useState<string>()

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
							label: classes.selectLabel,
							input: classes.multiselectInput,
						}}
						data={['Sprint', 'Hovedstyret', 'Koiene', 'Moment', 'Blits']}
						label={<span className={classes.badgeLabel}>Velg utvalg</span>}
						placeholder='Velg utvalg'
						searchable
						clearable
						nothingFound='Nothing found'
						value={committees}
						onChange={setCommittees}
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
			<div className={classes.filterPreview}>
				<div className={classes.filterChipsWrapper}>{filterBadge}</div>
				<Select
					classNames={{
						label: classes.selectLabel,
						input: classes.selectInput,
					}}
					data={['Nyeste først', 'Eldste først']}
					//label={<span className={classes.badgeLabel}>Sorter etter</span>}
					//nothingFound='Nothing found'
					defaultValue={'Nyeste først'}
					size='xs'
					value={dateSort}
					onChange={(e) => setDateSort(e as string)}
				/>
			</div>
		</div>
	)
}

export default FilterSearch
