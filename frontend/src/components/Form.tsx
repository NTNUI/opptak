import { TextInput, Checkbox, Button, Textarea } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import Committees from './Committees-select'

export function Form() {
	const form = useForm({
		initialValues: {
			email: '',
			name: '',
			phonenumber: '',
		},

		validationRules: {
			email: (value) => /^\S+@\S+$/.test(value),
			name: (value) => value.trim().length >= 2,
		},
	})

	return (
		<form onSubmit={form.onSubmit((values) => console.log(values))}>
			<TextInput required label='Fullt navn' {...form.getInputProps('name')} />
			<TextInput required label='Email' {...form.getInputProps('email')} />
			<TextInput
				required
				label='Telefonnummer'
				{...form.getInputProps('phonenumber')}
			/>
			<Textarea label='Søknadstekst' autosize minRows={2} />
			<Committees />

			<Button type='submit'>Send søknad</Button>
		</form>
	)
}
