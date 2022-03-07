import { TextInput, Button, Textarea, createStyles, MultiSelect } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { ICommittee } from '../types/committee'

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
		width: '40%',
		gap: '1rem',
		margin: 'auto',
	},
	blackground: {
		backgroundColor: 'black',
	},
	select: {
		color: 'white',
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

	const mapCommitteeToSelect = (committees: ICommittee[]) => {
		return committees.map((committee: ICommittee) => {
			return { value: committee._id.toString(), label: committee.name }
		})
	}
	const form = useForm({
		initialValues: {
			email: '',
			name: '',
			phonenumber: '',
			textarea: '',
			committees: [],
		},

		validationRules: {
			email: (value) => /^\S+@\S+$/.test(value),
			name: (value) => value.trim().length >= 2,
			phonenumber: (value) => /^[0-9]+$/.test(value),
			textarea: (value) => value.trim().length >= 2,
			committees: (value) => value.length > 0,
		},
	})

	return (
		<form
			className={classes.form}
			onSubmit={form.onSubmit((values) => console.log(values))}
		>
			<TextInput
				required label={<span className={classes.writtenText}>Fullt navn</span>}
				{...form.getInputProps('name')}
			/>
			<TextInput
				required label={<span className={classes.writtenText}>E-post</span>}
				{...form.getInputProps('email')}
			/>
			<TextInput
				required label={<span className={classes.writtenText}>Telefonnummer</span>}
				{...form.getInputProps('phonenumber')}
			/>
			<MultiSelect
				data={committees}
				required label={<span className={classes.select}>Hva ønsker du å søke?</span>}
				searchable
				{...form.getInputProps('committees')}
			/>
			<Textarea
				className={classes.blackground}
				required label={<span className={classes.writtenText}>Søknadstekst</span>}
				autosize
				minRows={3}
				{...form.getInputProps('textarea')}
			/>

			<Button type='submit'> ✓ Send søknad</Button>
		</form>
	)
}