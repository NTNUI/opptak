import { Box, createStyles, JsonInput } from '@mantine/core'
import React from 'react'
import { Form } from './Form'

const useStyles = createStyles((theme) => ({
	box: {
		backgroundColor: 'black',
		textAlign: 'left',
		borderRadius: '20px',
		cursor: 'pointer',
		color: 'white',
		borderColor: theme.colors.ntnui_yellow[9],
		border: '2px solid' + theme.colors.ntnui_yellow[9],
		width: '75%',
		margin: 'auto',
		justifyContent: 'center',
		paddingTop: '2rem',
		paddingBottom: '2rem',
		marginBottom: '4rem',
	},
	logo: {
		width: '50px',
	},
	header: {
		justifyContent: 'center',
		fontWeight: 'lighter',
		textAlign: 'center',
		width: '60%',
		margin: 'auto',
	},
}))

function FormBox() {
	const { classes } = useStyles()
	return (
		<Box className={classes.box}>
			<h1 className={classes.header}>Søknad til NTNUI Admin</h1>
			<Form />
		</Box>
	)
}

export default FormBox
