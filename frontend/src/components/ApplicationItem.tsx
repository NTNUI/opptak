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
			padding: theme.spacing.sm,
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
				marginLeft: '0',
				flexGrow: '3',
				whiteSpace: 'nowrap',
				fontWeight: '300',
				display: 'grid',
				gridTemplateColumns: '3fr 4fr',
			}}
		>
			<div style={{ paddingRight: '1rem' }}>{name}</div>
			<div
				style={{
					borderLeft: '1px solid #F8F082',
					paddingLeft: '1rem',
					textOverflow: 'ellipsis',
					overflow: 'hidden',
				}}
			>
				committee-name
			</div>
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
			<div
				style={{
					display: 'flex',
				}}
			>
				<Badge
					style={{ margin: 'auto' }}
					radius='sm'
					variant='outline'
					color='ntnui-yellow'
				>
					{submitted_date.toString().substring(0, 10)}
				</Badge>
			</div>
		</MantineProvider>
	</Box>
)

export default ApplicationItem
