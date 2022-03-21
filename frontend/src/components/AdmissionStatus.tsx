import { Container, createStyles, Switch } from '@mantine/core'

const useStyles = createStyles((theme) => ({
	container: {
		width: '50%',
		display: 'flex',
		gap: '1rem',
		alignItems: 'center',
		padding: '0',
		flexDirection: 'column',
		margin: '2rem auto',
		color: 'white',
		border: '1px solid ' + theme.colors.ntnui_yellow[9],
		borderRadius: '5px',
	},
	text: {
		textAlign: 'center',
	},
	committeesWrapper: {
		display: 'flex',
		flexDirection: 'column',
		padding: '0',
		gap: '1rem',
		margin: '1rem auto',
	},
	committees: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gap: '1rem',
	},
	switch: {
		input: {
			background: theme.colors.ntnui_red[9],
			border: 'none',
			'&:checked': {
				background: theme.colors.ntnui_green[9],
			},
			// '&::before': {
			// 	background: theme.colors.ntnui_background[9],
			// 	border: 'none',
			// },
		},
	},
}))

function AdmissionStatus() {
	const { classes } = useStyles()
	return (
		<Container className={classes.container}>
			<h1>Opptaksstatus</h1>
			<div className={classes.text}>
				Opptaksstatus avgjør om det skal være mulig for studenter å søke i den gitte
				opptaksperioden DD.MM.YYYY til DD.MM.YYYY
			</div>
			<div className={classes.committeesWrapper}>
				<div className={classes.committees}>
					<div>Event</div>
					<Switch
						className={classes.switch}
						color='theme.colors.ntnui_green[9]'
						size='md'
						radius='lg'
					/>
				</div>
				<div className={classes.committees}>
					<div>Sprint</div>
					<Switch className={classes.switch} size='md' radius='lg' />
				</div>
			</div>
		</Container>
	)
}

export default AdmissionStatus
