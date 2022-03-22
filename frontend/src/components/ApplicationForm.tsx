import {
	TextInput,
	Button,
	Textarea,
	createStyles,
	MultiSelect,
	Loader,
} from '@mantine/core'
import { useForm } from '@mantine/hooks'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNotifications } from '@mantine/notifications'
import { Check, ChevronDown, X } from 'tabler-icons-react'
import { ICommittee } from '../types/types'

interface ISubmissionApplication {
	email: string
	name: string
	phone_number: string
	text: string
	committees: string[]
}
interface ICommitteeInSelect {
	value: string
	label: string
}

const useStyles = createStyles((theme) => ({
	labelText: {
		fontWeight: 'italic',
		color: 'white',
	},
	form: {
		margin: '1rem 7rem 4rem 7rem',
		display: 'flex',
		flexDirection: 'column',
		gap: '0.5rem',
		'@media (max-width: 700px)': {
			width: '100%',
			margin: 0,
		},
	},
	formField: {
		backgroundColor: 'transparent',
		color: 'white',
	},
	multiSelectInput: {
		backgroundColor: 'transparent',
		color: 'black',
	},
	multiSelectRightSection: {
		'.mantine-MultiSelect-rightSection': { pointerEvents: 'none' },
	},
	submitButton: {
		width: '100%',
		marginTop: '1rem',
		transition: '0.2s',
		'&:hover': {
			backgroundColor: 'green',
		},
		'&:focus': {
			backgroundColor: 'darkgreen',
		},
	},
}))

export function Form() {
	const { classes } = useStyles()
	const [committees, setCommittees] = useState<ICommitteeInSelect[]>([])
	const [committeesFailed, setCommitteesFailed] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const notifications = useNotifications()
	const committeeNotification = useNotifications()

	useEffect(() => {
		if (!committeesFailed) {
			axios
				.get('/committees')
				.then((res) => {
					setCommittees(mapCommitteeToSelect(res.data))
				})
				.catch((err) => {
					setCommitteesFailed(true)
					committeeNotification.showNotification({
						title: 'Kunne ikke laste inn kommitteer!',
						message:
							'Last inn siden på nytt og prøv igjen. Ta kontakt med sprint@ntnui.no dersom problemet vedvarer',
						color: 'red',
						autoClose: false,
						icon: <X size={18} />,
					})
				})
		}
	}, [committeeNotification, committeesFailed])

	const submitForm = (values: ISubmissionApplication) => {
		setIsLoading(true)
		const id = notifications.showNotification({
			id: 'form-notification',
			title: 'Sender søknad',
			message: '',
			loading: true,
		})
		axios
			.post('/applications', values)
			.then((response) => {
				setIsLoading(false)
				form.reset()
				notifications.updateNotification(id, {
					id,
					loading: false,
					color: 'green',
					icon: <Check size={18} />,
					title: 'Søknad sendt til NTNUI!',
					message: 'Ha en fin dag videre!',
					autoClose: 7000,
				})
			})
			.catch((err) => {
				setIsLoading(false)
				notifications.updateNotification(id, {
					id,
					loading: false,
					color: 'red',
					icon: <X size={18} />,
					title: 'Noe gikk galt!',
					message: `En feil oppstod ved sending. Prøv igjen. Dersom det vedvarer ta kontakt med sprint@ntnui.no`,
					autoClose: 6000,
				})
			})
	}

	const mapCommitteeToSelect = (committees: ICommittee[]) => {
		return committees
			.filter((committee) => committee.accepts_applicants)
			.map((committee: ICommittee) => {
				return { value: committee._id.toString(), label: committee.name }
			})
	}

	const form = useForm({
		initialValues: {
			email: '',
			name: '',
			phone_number: '',
			text: '',
			committees: [],
		},

		validationRules: {
			email: (value) => /^\S+@\S+$/.test(value),
			name: (value) => value.trim().length >= 1,
			phone_number: (value) => /^\+{0,1}[0-9]+$/.test(value),
			text: (value) => value.trim().length >= 1,
			committees: (value) => value.length > 0,
		},

		errorMessages: {
			email: 'Ugyldig format på e-post; prøv igjen med formatet navn@domene.no',
			name: 'Feltet kan ikke være tomt',
			phone_number: 'Telefonnummer kan kun inneholde tall',
			text: 'Søknadsfeltet kan ikke være tomt',
			committees: 'Velg minst 1 komité',
		},
	})
	return (
		<form
			className={classes.form}
			onSubmit={form.onSubmit((values: ISubmissionApplication) =>
				submitForm(values)
			)}
		>
			<TextInput
				required
				autoComplete='name'
				classNames={{ label: classes.labelText, input: classes.formField }}
				label={'Fullt navn'}
				onBlur={() => form.validateField('name')}
				{...form.getInputProps('name')}
			/>
			<TextInput
				required
				autoComplete='email'
				classNames={{ label: classes.labelText, input: classes.formField }}
				label={'E-post'}
				onBlur={() => form.validateField('email')}
				{...form.getInputProps('email')}
			/>
			<TextInput
				required
				autoComplete='tel'
				classNames={{ label: classes.labelText, input: classes.formField }}
				label={'Telefonnummer'}
				onBlur={() => form.validateField('phone_number')}
				{...form.getInputProps('phone_number')}
			/>
			{!committeesFailed ? (
				<MultiSelect
					data={committees}
					required
					searchable
					rightSection={<ChevronDown size={14} />}
					rightSectionWidth={40}
					nothingFound='Kunne ikke finne utvalget du søker etter'
					className={classes.multiSelectRightSection}
					classNames={{ label: classes.multiSelectInput, input: classes.formField }}
					label={<span className={classes.labelText}>Hva ønsker du å søke?</span>}
					onBlur={() => form.validateField('committees')}
					{...form.getInputProps('committees')}
				/>
			) : (
				<MultiSelect
					data={committees}
					required
					disabled
					icon={<X size={18} />}
					placeholder='Kunne ikke laste inn kommitteer'
					classNames={{ label: classes.multiSelectInput, input: classes.formField }}
					label={<span className={classes.labelText}>Hva ønsker du å søke?</span>}
				/>
			)}
			<Textarea
				required
				classNames={{ label: classes.labelText, input: classes.formField }}
				label={'Søknadstekst'}
				autosize
				minRows={3}
				onBlur={() => form.validateField('text')}
				{...form.getInputProps('text')}
			/>

			<Button
				leftIcon={isLoading ? <Loader size={18} /> : <Check size={18} />}
				className={classes.submitButton}
				type='submit'
			>
				Send søknad
			</Button>
		</form>
	)
}
