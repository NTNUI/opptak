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
import { ICommittee } from '../types/committee'
import { useNotifications } from '@mantine/notifications'
import { Check, ChevronDown, X } from 'tabler-icons-react'

interface IApplication {
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
	writtenText: {
		fontWeight: 'italic',
		color: 'white',
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		width: '50%',
		gap: '1rem',
		margin: 'auto',
	},
	formField: {
		backgroundColor: 'transparent',
		color: 'white',
	},
	multiSelectInput: {
		backgroundColor: 'transparent',
		color: 'black',
	},
	commiteeSelectText: {
		color: 'white',
	},
	submitButton: {
		'&:hover': {
			backgroundColor: 'green',
			transition: '0.3s',
		},
	},
}))

export function Form() {
	const { classes } = useStyles()
	const [committees, setCommittees] = useState<ICommitteeInSelect[]>([])
	const [committeesFailed, setCommitteesFailed] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const notifications = useNotifications()

	useEffect(() => {
		axios
			.get('http://localhost:8082/committees/')
			.then((res) => {
				setCommittees(mapCommitteeToSelect(res.data))
			})
			.catch((err) => {
				setCommitteesFailed(true)
				notifications.showNotification({
					title: 'Kunne ikke laste inn kommitteer!',
					message: 'Ta kontakt med sprint@ntnui.no dersom problemet vedvarer',
					color: 'red',
					autoClose: false,
					icon: <X size={18} />,
				})
			})
	}, [])

	const submitForm = (values: IApplication) => {
		setIsLoading(true)
		const id = notifications.showNotification({
			id: 'form-notification',
			title: 'Sender søknad',
			message: '',
			loading: true,
		})
		axios
			.post('http://localhost:8082/applications/', values)
			.then((response) => {
				setIsLoading(false)
				form.reset()
				notifications.updateNotification(id, {
					id,
					loading: false,
					color: 'green',
					icon: <Check size={18} />,
					title: 'Søknad sendt',
					message: 'Ha en fin dag videre!',
					autoClose: 2500,
				})
			})
			.catch((err) => {
				notifications.updateNotification(id, {
					id,
					loading: false,
					color: 'red',
					icon: <X size={18} />,
					title: 'Noe gikk galt!',
					message: `En feil oppstod! Dersom det vedvarer ta kontakt med sprint@ntnui.no`,
					autoClose: 5000,
				})
			})
	}

	const mapCommitteeToSelect = (committees: ICommittee[]) => {
		return committees.map((committee: ICommittee) => {
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
			name: (value) => value.trim().length >= 2,
			phone_number: (value) => /^\+{0,1}[0-9]+$/.test(value),
			text: (value) => value.trim().length >= 2,
			committees: (value) => value.length > 0,
		},

		errorMessages: {
			email: 'Ugyldig format. E-post må inneholde @',
			name: 'Navn må inneholde minst 2 bokstaver',
			phone_number: 'Telefonnummer kan kun inneholde tall',
			text: 'Søknadsfeltet kan ikke være tom',
			committees: 'Velg minst 1 komité',
		},
	})
	return (
		<form
			className={classes.form}
			onSubmit={form.onSubmit((values: IApplication) => submitForm(values))}
		>
			<TextInput
				required
				autoComplete='name'
				classNames={{ label: classes.writtenText, input: classes.formField }}
				label={'Fullt navn'}
				onBlur={() => form.validateField('name')}
				{...form.getInputProps('name')}
			/>
			<TextInput
				required
				autoComplete='email'
				classNames={{ label: classes.writtenText, input: classes.formField }}
				label={'E-post'}
				onBlur={() => form.validateField('email')}
				{...form.getInputProps('email')}
			/>
			<TextInput
				required
				autoComplete='tel'
				classNames={{ label: classes.writtenText, input: classes.formField }}
				label={'Telefonnummer'}
				onBlur={() => form.validateField('phone_number')}
				{...form.getInputProps('phone_number')}
			/>
			{!committeesFailed ? (
				<MultiSelect
					data={committees}
					required
					rightSection={<ChevronDown size={14} />}
					rightSectionWidth={40}
					nothingFound='Kunne ikke finne utvalget du søker etter'
					classNames={{ label: classes.multiSelectInput, input: classes.formField }}
					label={<span className={classes.writtenText}>Hva ønsker du å søke?</span>}
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
					label={<span className={classes.writtenText}>Hva ønsker du å søke?</span>}
				/>
			)}
			<Textarea
				required
				classNames={{ label: classes.writtenText, input: classes.formField }}
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
