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
	},
}))

function ApplicationItem({ name, committees, submitted_date }: IApplication) {
	const { classes } = useStyles()
	return (
		<Box className={classes.box}>
			<div className={classes.grid}>
				<div className={classes.nameDiv}>{name}</div>
				<div className={classes.committeeDiv}>committee-name</div>
			</div>
			<div className={classes.badgeDiv}>
				<Badge
					style={{ margin: 'auto' }}
					radius='sm'
					variant='outline'
					color='yellow'
				>
					{submitted_date.toString().substring(0, 10)}
				</Badge>
			</div>
		</Box>
	)
}

export default ApplicationItem
