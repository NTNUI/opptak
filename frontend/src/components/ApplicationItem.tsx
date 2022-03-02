import { Badge, Box, createStyles } from '@mantine/core'
import IApplication from '../types/application'

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
		display: 'grid',
		gridTemplateColumns: '3fr 4fr',
	},
	nameDiv: {
		paddingRight: '1rem',
		minWidth: '8em',
	},
	committeeDiv: {
		borderLeft: '1px solid #F8F082',
		paddingLeft: '1rem',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
	},
	badgeDiv: {
		display: 'flex',
		color: theme.colors.ntnui_yellow[9],
	},
	badge: {
		color: theme.colors.ntnui_yellow[9],
		borderColor: theme.colors.ntnui_yellow[9],
		margin: 'auto',
	},
}))

function ApplicationItem({ name, committees, submitted_date }: IApplication) {
	const { classes } = useStyles()

	const date = new Date(submitted_date)

	const result = date.toLocaleDateString('en-GB', {
		// you can use undefined as first argument
		// year: '2-digit',
		month: 'short',
		day: '2-digit',
	})

	return (
		<Box className={classes.box}>
			<div className={classes.grid}>
				<div className={classes.nameDiv}>{name}</div>
				<div className={classes.committeeDiv}>committee-name</div>
			</div>
			<div className={classes.badgeDiv}>
				<Badge className={classes.badge} radius='sm' variant='outline'>
					{result}
				</Badge>
			</div>
		</Box>
	)
}

export default ApplicationItem
