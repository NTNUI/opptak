import { TextInput, Button, Textarea } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import Committees from './Committees-select'

export function Form() {
	const form = useForm({
		initialValues: {
			email: '',
			name: '',
			phonenumber: '',
			textarea: '',
			committeeselect: '',
		},

		validationRules: {
			email: (value) => /^\S+@\S+$/.test(value),
			name: (value) => value.trim().length >= 2,
			phonenumber: (value) => /^[0-9]+$/.test(value),
			textarea: (value) => value.trim().length >= 1
		},
	})

	return (
		<form onSubmit={form.onSubmit((values) => console.log(values))}>
			<TextInput required label='Fullt navn' {...form.getInputProps('name')} />
			<TextInput required label='E-post' {...form.getInputProps('email')} />
			<TextInput
				required
				label='Telefonnummer'
				{...form.getInputProps('phonenumber')}
			/>
			<Committees />
			<Textarea required label='Søknadstekst' autosize minRows={2} />

			<Button type='submit'>Send søknad</Button>
		</form>
	)
}
