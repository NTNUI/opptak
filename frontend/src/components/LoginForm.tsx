import {
	Button,
	createStyles,
	InputWrapper,
	PasswordInput,
	Select,
	TextInput,
	Tooltip,
} from '@mantine/core'
import {
	ChevronDown,
	InfoCircle,
	Lock,
	Phone,
	World,
	X,
} from 'tabler-icons-react'
import { useForm } from '@mantine/form'
import { Notification } from '@mantine/core'
import countryCodes from '../utils/countryCodes'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../services/Auth'

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
		'.mantine-Select-rightSection': { pointerEvents: 'none' },
		input: {
			gridArea: 'country_code',
			backgroundColor: 'transparent',
			borderRadius: '5px 0 0 5px',
			color: 'white',
			width: '100%',
			transition: '0.3s',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
		},
	},
	numberInput: {
		input: {
			borderLeft: 0,
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
		marginBottom: '10px',
		input: {
			backgroundColor: theme.colors.ntnui_background[9],
			color: 'white',
		},
	},
	submitButton: {
		transition: '0.3s',
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

interface formValues {
	country_code: string
	phone_number: string
	password: string
}

interface countryCodePair {
	land: string
	kode: string
}

function LoginForm() {
	const { classes } = useStyles()
	let navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(false)

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

	const submitLoginForm = (values: formValues) => {
		setIsLoading(true)
		const credentials = {
			phone_number: '+' + values.country_code + values.phone_number,
			password: values.password,
		}
		try {
			login(credentials.phone_number, credentials.password)
				.then((response) => {
					setIsLoading(false)
					navigate('/dashboard')
				})
				.catch(() => {
					setIsLoading(false)
					setError(true)
				})
		} catch (error) {
			setIsLoading(false)
			console.log(`Caught by try/catch ${error}`)
		}
	}

	const countryCodesToSelect = countryCodes.map((code: countryCodePair) => {
		return {
			key: code.land,
			value: code.kode,
			label: `(+${code.kode}) ${code.land}`,
		}
	})

	return (
		<form
			onSubmit={form.onSubmit((values) => submitLoginForm(values))}
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
									Logg inn med samme telefonnummer som du bruker i medlemssystemet
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
					placeholder='Telefon'
					icon={<Phone size={18} />}
					className={classes.numberInput}
					{...form.getInputProps('phone_number')}
					onBlur={() => form.validateField('phone_number')}
				/>
			</InputWrapper>
			<PasswordInput
				required
				autoComplete='password'
				label='Passord'
				placeholder='Passord'
				icon={<Lock size={18} />}
				className={classes.passwordInput}
				{...form.getInputProps('password')}
			/>
			{error && (
				<Notification
					title='Kunne ikke logge inn!'
					disallowClose
					onClose={() => {}}
					icon={<X size={18} />}
					color='red'
				>
					Finner ingen bruker med dette nummeret og dette passordet.
				</Notification>
			)}
			<Button
				loading={isLoading}
				uppercase
				className={classes.submitButton}
				type='submit'
			>
				Logg inn
			</Button>
			<Button uppercase className={classes.forgottenButton} variant='outline'>
				Glemt passord
			</Button>
		</form>
	)
}

export default LoginForm
