import {
	TextInput,
	Button,
	Textarea,
	createStyles,
	MultiSelect,
} from '@mantine/core'
import { useForm } from '@mantine/hooks'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { ICommittee } from '../types/committee'
import { Check } from 'tabler-icons-react'

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

	useEffect(() => {
		axios
			.get('http://localhost:8082/committees/')
			.then((res) => setCommittees(mapCommitteeToSelect(res.data)))
			.catch((err) => console.log(err))
	}, [])

	const submitForm = (values: IApplication) => {
		const toNumbers = () =>
			committees.map((str) => {
				return Number(str)
			})
		toNumbers()
		axios
			.post('http://localhost:8082/applications/', values)
			.then((response) => form.reset())
			.catch((err) => console.log(err))
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
			<MultiSelect
				data={committees}
				required
				classNames={{ label: classes.multiSelectInput, input: classes.formField }}
				label={<span className={classes.writtenText}>Hva ønsker du å søke?</span>}
				searchable
				clearable
				onBlur={() => form.validateField('committees')}
				{...form.getInputProps('committees')}
			/>
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
				leftIcon={<Check size={18} />}
				className={classes.submitButton}
				type='submit'
			>
				Send søknad
			</Button>
		</form>
	)
}
