import { Box, Button, createStyles, TextInput } from '@mantine/core'
import { Modal } from '@mantine/core'
import { useForm } from '@mantine/form'
import {
	useNotifications,
	showNotification,
	updateNotification,
} from '@mantine/notifications'
import { Check, Trash, X } from 'tabler-icons-react'
import { wipeApplicationData } from '../services/Applications'

interface IWipeModal {
	opened: boolean
	setOpened: (opened: boolean) => void
}

const useStyles = createStyles((theme) => ({
	labelText: {
		color: 'white',
	},
	inputField: {
		backgroundColor: 'transparent',
		color: 'white',
	},
	modal: {
		backgroundColor: theme.colors.ntnui_background[9],
		color: 'white',
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
	},
	modalTitle: {
		color: 'white',
		fontSize: '1rem',
		textAlign: 'center',
		width: '100%',
		h1: {
			fontWeight: 500,
			margin: 0,
		},
		span: {
			color: theme.colors.ntnui_red[9],
		},
	},
	modalCloseButton: {
		alignSelf: 'start',
		transition: '0.2s',
		color: theme.colors.ntnui_red[9],
		':hover': {
			backgroundColor: theme.colors.ntnui_red[9] + '4D',
		},
	},
	buttonWrapper: {
		display: 'flex',
		gap: '1rem',
		margin: '1rem 0 0 0',
		'@media (max-width: 400px)': {
			flexDirection: 'column',
		},
	},
	cancelButton: {
		width: '100%',
		backgroundColor: theme.colors.ntnui_red[9],
		transition: '0.3s',
		border: '2px solid' + theme.colors.ntnui_red[9],
		fontWeight: 500,
		':hover': {
			border: '2px solid' + theme.colors.ntnui_red[9],
			color: theme.colors.ntnui_red[9],
			backgroundColor: 'transparent',
		},
	},
	confirmButton: {
		width: '100%',
		backgroundColor: theme.colors.ntnui_blue[9],
		border: '2px solid' + theme.colors.ntnui_blue[9],
		transition: '0.3s',
		fontWeight: 500,
		':hover': {
			border: '2px solid' + theme.colors.ntnui_blue[9],
			color: theme.colors.ntnui_blue[9],
			backgroundColor: 'transparent',
		},
	},
	slettSpan: {
		color: 'white',
		fontWeight: 600,
	},
}))

function WipeModal({ opened, setOpened }: IWipeModal) {
	const { classes } = useStyles()
	const notifications = useNotifications()

	// Validate input
	const form = useForm({
		initialValues: {
			confirm: '',
		},
		validate: {
			confirm: (value: string) =>
				value === 'slett' ? undefined : 'Skriv inn "slett"',
		},
	})

	const handleWipeApplicationData = async () => {
		if (form.validate().hasErrors) return
		// Wipe app data
		showNotification({
			id: 'wipe-notification',
			title: 'Sletter opptaksdata...',
			message: '',
			loading: true,
			autoClose: false,
		})
		try {
			await wipeApplicationData()
			updateNotification({
				id: 'wipe-notification',
				loading: false,
				color: 'green',
				icon: <Check size={18} />,
				title: 'Opptaksdata slettet!',
				message: '',
				autoClose: 5000,
			})
			form.reset()
			setOpened(false)
		} catch (error: any) {
			console.log(error.response.status)
			if (error.response.status === 403) {
				updateNotification({
					id: 'wipe-notification',
					loading: false,
					color: 'red',
					icon: <X size={18} />,
					title: 'Du har ikke rettighetene til å slette opptaksdata!',
					message: '',
					autoClose: 6000,
				})
			} else {
				updateNotification({
					id: 'wipe-notification',
					loading: false,
					color: 'red',
					icon: <X size={18} />,
					title: 'Noe gikk galt ved sletting av opptaksdata!',
					message: `En feil oppstod ved sletting. Prøv igjen. Dersom det vedvarer ta kontakt med sprint@ntnui.no`,
					autoClose: 6000,
				})
			}
		}
	}

	return (
		<Modal
			title={
				<h1>
					<span>Slett</span> all opptaksdata
				</h1>
			}
			size='lg'
			centered
			opened={opened}
			onClose={() => setOpened(false)}
			classNames={{
				title: classes.modalTitle,
				close: classes.modalCloseButton,
				modal: classes.modal,
			}}
		>
			<p>Dette er ment å gjøres når man er ferdig med semesterets opptak.</p>
			<p>Ved sletting av all opptaksdata slettes følgende:</p>
			<ul>
				<li>Alle søknader som er sendt inn og tilhørende data</li>
				<li>Alle kontoer i søknadssystemet som har logget inn</li>
			</ul>

			<form onSubmit={form.onSubmit(handleWipeApplicationData)}>
				<TextInput
					required
					classNames={{ label: classes.labelText, input: classes.inputField }}
					label={
						<>
							Skriv
							<span className={classes.slettSpan}> "slett" </span>
							for å bekrefte
						</>
					}
					onBlur={() => form.validateField('confirm')}
					{...form.getInputProps('confirm')}
				/>
				<Box className={classes.buttonWrapper}>
					<Button
						onClick={() => setOpened(false)}
						className={classes.cancelButton}
						leftIcon={<X size={18} />}
					>
						Avbryt
					</Button>
					<Button
						type='submit'
						onClick={handleWipeApplicationData}
						className={classes.confirmButton}
						leftIcon={<Trash size={18} />}
					>
						Slett opptaksdata
					</Button>
				</Box>
			</form>
		</Modal>
	)
}

export default WipeModal
