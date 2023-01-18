import {
	ActionIcon,
	CopyButton as MantineCopyButton,
	createStyles,
	Tooltip,
} from '@mantine/core'
import { Check, Copy } from 'tabler-icons-react'

const useStyles = createStyles((theme) => ({
	button: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		'&:hover': {
			backgroundColor: theme.colors.ntnui_yellow[9] + '0F',
		},
	},
}))

function NTNUICopyButton({ value }: { value: string }) {
	const { classes } = useStyles()
	return (
		<MantineCopyButton value={value} timeout={2000}>
			{({ copied, copy }) => (
				<Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position='right'>
					<ActionIcon
						className={classes.button}
						color={copied ? 'ntnui_green.9' : 'ntnui_yellow.9'}
						onClick={copy}
					>
						{copied ? <Check size={16} /> : <Copy size={16} />}
					</ActionIcon>
				</Tooltip>
			)}
		</MantineCopyButton>
	)
}

export default NTNUICopyButton
