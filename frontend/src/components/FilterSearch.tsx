import {
	ActionIcon,
	Collapse,
	createStyles,
	Input,
	MultiSelect,
	Select,
} from '@mantine/core'
import { useState } from 'react'
import { Search, Adjustments } from 'tabler-icons-react'

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
	multiselectLabel: {
		//color: 'white',
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
}))

function FilterSearch() {
	const { classes } = useStyles()
	const [opened, setOpen] = useState(false)

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
							label: classes.multiselectLabel,
						}}
						variant='filled'
						data={['Sprint', 'Hovedstyret', 'Koiene', 'Moment', 'Blits']}
						label='Velg utvalg'
						placeholder='Velg utvalg'
						searchable
						nothingFound='Nothing found'
					/>
					<Select
						classNames={{
							label: classes.multiselectLabel,
						}}
						variant='filled'
						data={['Alle', 'Akseptert', 'Innkalt', 'Ubehandlet', 'Avvist']}
						label='Velg status'
						placeholder='Velg status'
						nothingFound='Nothing found'
					/>
				</div>
			</Collapse>
		</div>
	)
}

export default FilterSearch
