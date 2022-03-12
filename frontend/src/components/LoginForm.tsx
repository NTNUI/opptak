import {
	Button,
	createStyles,
	InputWrapper,
	PasswordInput,
	Select,
	TextInput,
	Tooltip,
} from '@mantine/core'
import { ChevronDown, InfoCircle, Lock, Phone, World } from 'tabler-icons-react'
import { useForm } from '@mantine/form'
import { countryCodes } from '../utils/countryCodes'

const useStyles = createStyles((theme) => ({
	phoneNumberWrapper: {
		width: '100%',
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gridTemplateRows: '1fr auto',
		gridTemplateAreas: `
        "label label"
        "country_code phone_number"
        `,
		label: {
			gridArea: 'label',
			alignSelf: 'center',
			color: 'white',
			display: 'flex',
			alignItems: 'center',
			margin: 0,
		},
	},
	selectCountryCodeInput: {
		color: 'white',
		input: {
			gridArea: 'country_code',
			backgroundColor: 'transparent',
			borderRadius: '5px 0 0 5px',
			borderRight: 0,
			color: 'white',
			width: '100%',
		},
	},
	numberInput: {
		input: {
			gridArea: 'phone_number',
			backgroundColor: 'transparent',
			color: 'white',
			borderRadius: '0px 5px 5px 0px',
			width: '100%',
		},
		'.mantine-TextInput-error': {
			margin: 0,
		},
	},
	passwordInput: {
		label: { color: 'white' },
		width: '100%',
		input: {
			backgroundColor: theme.colors.ntnui_background[9],
			color: 'white',
		},
	},
	submitButton: {
		width: '100%',
		margin: '1rem 0 0.5rem 0',
	},
	forgottenButton: {
		color: 'white',
		width: '100%',
		transition: '0.3s',
		'&:hover': {
			color: theme.colors.ntnui_background[9],
			background: theme.colors.ntnui_blue[9],
		},
	},
	link: {
		textDecoration: 'none',
		color: theme.colors.ntnui_blue[9],
	},
	loginTooltip: {
		margin: '0 0 0 1px',
		textAlign: 'center',
		'*': {
			// Aligns info-icon with phonenumber
			display: 'flex',
			alignContent: 'center',
			justifyContent: 'center',
		},
	},
	form: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
	},
}))

function LoginForm() {
	const { classes } = useStyles()
	const form = useForm({
		initialValues: {
			country_code: '47',
			phone_number: '',
			password: '',
		},

		validate: {
			phone_number: (value) =>
				!/^[0-9]{8,}$/.test(value) ? 'Formatet er ugyldig' : null,
		},
	})

	const countryCodesToSelect = countryCodes.map((code: any) => {
		return {
			key: code.name,
			value: code.dialCode,
			label: `${code.name} (+${code.dialCode})`,
		}
	})

	return (
		<form
			onSubmit={form.onSubmit((values) => console.log(values))}
			className={classes.form}
		>
			<InputWrapper
				required
				label={
					<>
						Telefon
						<Tooltip
							position='top'
							allowPointerEvents
							className={classes.loginTooltip}
							classNames={{ body: classes.loginTooltip }}
							color='dark'
							width={250}
							transition='pop'
							label={
								<>
									Logg inn med samme telefonnummer som du bruker i medlemssystemet{' '}
									<a className={classes.link} href='https://medlem.ntnui.no/login'>
										medlem.ntnui.no
									</a>
								</>
							}
							withArrow
							wrapLines
						>
							<InfoCircle size={18} />
						</Tooltip>
					</>
				}
				className={classes.phoneNumberWrapper}
			>
				<Select
					required
					aria-label='Velg din landskode'
					data={countryCodesToSelect}
					rightSection={<ChevronDown size={18} />}
					rightSectionWidth={30}
					icon={<World size={18} />}
					className={classes.selectCountryCodeInput}
					{...form.getInputProps('country_code')}
				/>
				<TextInput
					required
					type='tel'
					placeholder='Ditt telefonnummer'
					icon={<Phone size={18} />}
					className={classes.numberInput}
					{...form.getInputProps('phone_number')}
					onBlur={() => form.validateField('phone_number')}
				/>
			</InputWrapper>
			<PasswordInput
				required
				label='Passord'
				placeholder='Passord'
				icon={<Lock size={18} />}
				className={classes.passwordInput}
				{...form.getInputProps('password')}
			/>
			<Button uppercase className={classes.submitButton} type='submit'>
				Logg inn
			</Button>
			<Button uppercase className={classes.forgottenButton} variant='outline'>
				Glemt passord
			</Button>
		</form>
	)
}

export default LoginForm
