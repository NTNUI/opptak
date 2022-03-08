import { Box, createStyles } from '@mantine/core'
import { useMemo } from 'react'
import { IApplication, ICommittee } from '../types/application'

const useStyles = createStyles((theme) => ({
	box: {
		color: theme.colors.gray[2],
		border: '2px solid #F8F082',
		padding: theme.spacing.sm,
		borderRadius: theme.radius.sm,
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		gap: '0.5rem',
		'&:hover': {
			backgroundColor: '#282c34',
		},
	},
	grid: {
		marginLeft: '0',
		flexGrow: '3',
		whiteSpace: 'nowrap',
		fontWeight: '300',
		fontSize: 'medium',
		display: 'grid',
		gap: '1em',
		gridTemplateColumns: '6fr 10fr 2fr',
	},
	nameDiv: {
		minWidth: '8em',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	committeeDiv: {
		borderLeft: '1px solid #F8F082',
		paddingLeft: '1rem',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	badgeDiv: {
		display: 'flex',
		alignContent: 'center',
		color: theme.colors.ntnui_yellow[9],
	},
	date: {
		color: theme.colors.ntnui_yellow[9],
		whiteSpace: 'nowrap',

		margin: 'auto',
		'@media (max-width: 500px)': {
			fontSize: 'medium',
		},
		'@media (min-width: 500px)': {
			fontSize: 'medium',
		},
	},
}))

function ApplicationItem({ name, committees, submitted_date }: IApplication) {
	const { classes } = useStyles()

	const date = new Date(submitted_date)

	const submittedDate = date.toLocaleDateString('en-GB', {
		month: 'short',
		day: '2-digit',
	})

	const stringifyCommittees = (committees: ICommittee[]) => {
		const committeeNames = committees.map((committee) => committee.name)
		return committeeNames.reduce((left, right) => {
			return left + ', ' + right
		})
	}

	const stringifiedCommittees = useMemo(
		() => stringifyCommittees(committees),
		[committees]
	)

	return (
		<Box className={classes.box}>
			<div className={classes.grid}>
				<div className={classes.nameDiv}>{name}</div>
				<div className={classes.committeeDiv}>
					{/* Tooltip is incompatible with ellipsis */}
					{/* <Tooltip
						label={stringifiedCommittees}
						transition='pop'
						transitionDuration={300}
						placement='start'
						transitionTimingFunction='ease'
						className='tooltip'
					> */}
					{stringifiedCommittees}
					{/* </Tooltip> */}
				</div>
				<div className={classes.badgeDiv}>
					<span className={classes.date}>{submittedDate.toUpperCase()}</span>
				</div>
			</div>
		</Box>
	)
}

export default ApplicationItem
