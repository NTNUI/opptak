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
import { ErrorNotification, SuccessNotification } from './Notification'

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
		backgroundColor: 'black',
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		width: '50%',
		gap: '1rem',
		margin: 'auto',
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
			.then((res) => {
				return SuccessNotification()
			})
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
			.then((response) => {
				return SuccessNotification()
			})
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
			phone_number: (value) => /^[0-9]+$/.test(value),
			text: (value) => value.trim().length >= 2,
			committees: (value) => value.length > 0,
		},
	})
	return (
		<form
			className={classes.form}
			onSubmit={form.onSubmit((values: IApplication) => submitForm(values))}
		>
			<TextInput
				required
				label={<span className={classes.writtenText}>Fullt navn</span>}
				{...form.getInputProps('name')}
			/>
			<TextInput
				required
				label={<span className={classes.writtenText}>E-post</span>}
				{...form.getInputProps('email')}
			/>
			<TextInput
				required
				label={<span className={classes.writtenText}>Telefonnummer</span>}
				{...form.getInputProps('phone_number')}
			/>
			<MultiSelect
				data={committees}
				required
				label={
					<span className={classes.commiteeSelectText}>Hva ønsker du å søke?</span>
				}
				searchable
				{...form.getInputProps('committees')}
			/>
			<Textarea
				required
				label={<span className={classes.writtenText}>Søknadstekst</span>}
				autosize
				minRows={3}
				{...form.getInputProps('text')}
			/>

			<Button className={classes.submitButton} type='submit'>
				{' '}
				✓ Send søknad
			</Button>
		</form>
	)
}
