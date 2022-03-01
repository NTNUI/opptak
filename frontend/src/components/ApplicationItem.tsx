import { ThemeContext } from '@emotion/react'
import { Badge, Box, MantineProvider } from '@mantine/core'
import { type } from 'os'
import IApplication from '../types/application'

const ApplicationItem = ({
	name,
	committees,
	submitted_date,
}: IApplication) => (
	<Box
		sx={(theme) => ({
			color: theme.colors.gray[2],
			border: '2px solid #F8F082',
			textAlign: 'center',
			padding: theme.spacing.md,
			borderRadius: theme.radius.sm,
			cursor: 'pointer',
			display: 'flex',
			flexDirection: 'row',
			gap: '0.5rem',
			'&:hover': {
				backgroundColor: '#282c34',
			},
		})}
	>
		<div
			style={{
				flexGrow: '3',
				display: 'inline-block',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
			}}
		>
			{name} | committee-name
		</div>

		<MantineProvider
			theme={{
				colors: {
					'ntnui-yellow': [
						'#F8F082',
						'#F8F082',
						'#F8F082',
						'#F8F082',
						'#F8F082',
						'#F8F082',
						'#F8F082',
						'#F8F082',
						'#F8F082',
						'#F8F082',
					],
				},
			}}
		>
			<div>
				<Badge radius='sm' variant='outline' color='ntnui-yellow'>
					{submitted_date.toString().substring(0, 10)}
				</Badge>
			</div>
		</MantineProvider>
	</Box>
)

export default ApplicationItem
