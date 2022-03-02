import { Box } from '@mantine/core'
import React from 'react'
import { Form } from './Form'

const FormBox = () => (
	<Box
		sx={(theme) => ({
			backgroundColor: 'white',
			textAlign: 'center',
			padding: theme.spacing.xl,
			borderRadius: theme.radius.md,
			cursor: 'pointer',

			'&:hover': {
				backgroundColor: 'white',
			},
		})}
	>
		Søknad til NTNUI admin
        <Form />
	</Box>
)

export default FormBox
