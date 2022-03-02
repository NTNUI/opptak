import { Box } from '@mantine/core'
import React from 'react'
import { Form } from './Form'

const FormBox = () => (
	<Box
		sx={(theme) => ({
			backgroundColor: 'black',
			textAlign: 'left',
			padding: theme.spacing.xl,
			borderRadius: theme.radius.md,
			cursor: 'pointer',
			color: 'white'
		})}
	>
		Søknad til NTNUI admin
        <Form />
		
	</Box>
)

export default FormBox
