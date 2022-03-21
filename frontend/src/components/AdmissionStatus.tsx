import {
	Button,
	Container,
	createStyles,
	Group,
	Modal,
	Switch,
} from '@mantine/core'
import { useState } from 'react'
import { DeviceFloppy, X } from 'tabler-icons-react'

const useStyles = createStyles((theme) => ({
	modal: {
		border: '1px solid ' + theme.colors.ntnui_yellow[9],
		backgroundColor: theme.colors.ntnui_background[9],
	},
	modalBody: {
		display: 'flex',
		gap: '1rem',
		alignItems: 'center',
		flexDirection: 'column',
		margin: '2rem auto',
		color: 'white',
		borderRadius: '5px',
		h1: {
			margin: 0,
		},
	},
	text: {
		textAlign: 'center',
	},
	committeesWrapper: {
		display: 'flex',
		flexDirection: 'column',
		padding: '0.5rem',
		gap: '1rem',
		margin: 'auto',
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
	buttonWrapper: {
		display: 'flex',
		gap: '1rem',
		//maxWidth: '100%',
		flexWrap: 'wrap',
		margin: 'auto',
		alignContent: 'center',
	},
	save: {
		margin: 'auto',
		transition: '0.3s',
		backgroundColor: theme.colors.ntnui_blue[9],
		border: '2px solid' + theme.colors.ntnui_blue[9],
		':hover': {
			border: '2px solid' + theme.colors.ntnui_blue[9],
			color: theme.colors.ntnui_blue[9],
			backgroundColor: 'transparent',
		},
	},
	cancel: {
		margin: 'auto',
		transition: '0.3s',
		backgroundColor: theme.colors.ntnui_red[9],
		border: '2px solid' + theme.colors.ntnui_red[9],
		color: 'white',

		':hover': {
			border: '2px solid' + theme.colors.ntnui_red[9],
			color: theme.colors.ntnui_red[9],
			backgroundColor: 'transparent',
		},
	},
	icons: {},
}))

function AdmissionStatus() {
	const { classes } = useStyles()
	const [opened, setOpened] = useState(false)

	return (
		<>
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				withCloseButton={false}
				overlayOpacity={0.4}
				classNames={{
					modal: classes.modal,
					body: classes.modalBody,
				}}
			>
				<h1>Opptaksstatus</h1>
				<div className={classes.text}>
					Opptaksstatus avgjør om det skal være mulig for studenter å søke i den
					gitte opptaksperioden DD.MM.YYYY til DD.MM.YYYY
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
				<div className={classes.buttonWrapper}>
					<Button onClick={() => setOpened(false)} className={classes.cancel}>
						<X className='icons' size={20} strokeWidth={2.5} />
						Avbryt
					</Button>
					<Button className={classes.save}>
						<DeviceFloppy className='icons' size={20} strokeWidth={1.5} />
						Lagre endringer
					</Button>
				</div>
			</Modal>

			<Group position='center'>
				<Button onClick={() => setOpened(true)}>Opptaksstatus</Button>
			</Group>
		</>
	)
}

export default AdmissionStatus
