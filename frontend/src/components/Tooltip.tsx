import { createStyles, Tooltip } from '@mantine/core'
import { InfoCircle } from 'tabler-icons-react'

const useStyles = createStyles(() => ({
	tooltip: {
		margin: '0 0 0 2px',
		textAlign: 'center',
		svg: {
			// Aligns info-icon with label
			display: 'flex',
			alignContent: 'center',
			justifyContent: 'center',
		},
	},
}))

const NtnuiInfoTooltip = (label: JSX.Element) => {
	const { classes } = useStyles()
	return (
		<Tooltip
			position='top'
			allowPointerEvents
			className={classes.tooltip}
			classNames={{ body: classes.tooltip }}
			color='dark'
			width={250}
			transition='pop'
			label={label}
			wrapLines
		>
			<InfoCircle size={16} />
		</Tooltip>
	)
}

export default NtnuiInfoTooltip