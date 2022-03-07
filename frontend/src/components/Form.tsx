import { TextInput, Button, Textarea, createStyles } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import Committees from './Committees-select'

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
		backgroundColor: "black",
	},
}))

export function Form() {
	const { classes } = useStyles()
	const form = useForm({
		initialValues: {
			email: '',
			name: '',
			phonenumber: '',
			textarea: '',
		},

		validationRules: {
			email: (value) => /^\S+@\S+$/.test(value),
			name: (value) => value.trim().length >= 2,
			phonenumber: (value) => /^[0-9]+$/.test(value),
			textarea: (value) => value.trim().length >= 2,

		},
	})

	return (
		<form
			className={classes.form}
			onSubmit={form.onSubmit((values) => console.log(values))}
		>
			<TextInput
				label={<span className={classes.writtenText}>Fullt navn</span>}
				{...form.getInputProps('name')}
			/>
			<TextInput
				label={<span className={classes.writtenText}>E-post</span>}
				{...form.getInputProps('email')}
			/>
			<TextInput
				label={<span className={classes.writtenText}>Telefonnummer</span>}
				{...form.getInputProps('phonenumber')}
			/>
			<Committees  />
			<Textarea
				className={classes.blackground}
				label={<span className={classes.writtenText}>Søknadstekst</span>}
				autosize
				minRows={3}
				{...form.getInputProps('textarea')}
				
			/>

			<Button type='submit'> ✓ Send søknad</Button>
		</form>
	)
}
