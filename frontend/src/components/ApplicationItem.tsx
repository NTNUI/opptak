import { Box, createStyles } from '@mantine/core'
import { useMemo } from 'react'
import { IApplication, ICommittee } from '../types/types'

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
		transition: 'ease-in-out 0.1s',
		boxShadow: '0rem 0.2rem 0.4rem ' + theme.colors.dark[7],

		'&:hover': {
			color: '#F8F082',
			boxShadow: '0 0 5px #F8F082',
		},
		'&:active': {
			color: '#F8F082',
			boxShadow: '0 0 2px #F8F082',
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

interface IApplicationItem extends IApplication {
	handleClick(id: string): void
}
function ApplicationItem({
	_id,
	name,
	committees,
	submitted_date,
	handleClick,
}: IApplicationItem) {
	const { classes } = useStyles()

	const date = new Date(submitted_date)

	const submittedDate = date.toLocaleDateString('en-GB', {
		month: 'short',
		day: '2-digit',
	})

	const stringifyCommittees = (committees: ICommittee[]) => {
		if (committees.length) {
			const committeeNames = committees.map((committee) => committee.name)
			return committeeNames.reduce((left, right) => {
				return left + ', ' + right
			})
		} else {
			return 'N/A'
		}
	}

	const stringifiedCommittees = useMemo(
		() => stringifyCommittees(committees),
		[committees]
	)

	return (
		<Box className={classes.box} onClick={() => handleClick(_id)}>
			<div className={classes.grid}>
				<div className={classes.nameDiv}>{name}</div>
				<div id='committee' className={classes.committeeDiv}>
					{stringifiedCommittees}
				</div>
				<div className={classes.badgeDiv}>
					<span className={classes.date}>{submittedDate.toUpperCase()}</span>
				</div>
			</div>
		</Box>
	)
}

export default ApplicationItem
