import { Box, Button, createStyles } from '@mantine/core'
import React from 'react'
import { Form } from '../components/ApplicationForm'

const useStyles = createStyles((theme) => ({
	formWrapper: {
		backgroundColor: 'black',
		textAlign: 'left',
		borderRadius: '20px',
		color: 'white',
		border: '2px solid' + theme.colors.ntnui_yellow[9],
		width: '50%',
		margin: 'auto auto 4rem auto',
		justifyContent: 'center',
		padding: '2rem 0 2rem 0',
		'@media (max-width: 700px)': {
			padding: '2rem',
			margin: 0,
		},
	},
	header: {
		width: '100%',
		margin: '2rem 0 2rem 0',
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
	},
	logo: {
		height: '100px',
		justifySelf: 'center',
		gridColumn: 3,
	},
	internButton: {
		width: '40%',
		justifySelf: 'end',
		margin: '0 2rem 0 0',
		fontFamily: 'Poppins',
		fontWeight: 'normal',
		gridColumn: 5,
	},
}))

function FormBox() {
	const { classes } = useStyles()
	return (
		<>
			<Box className={classes.header}>
				<img alt='NTNUI logo' className={classes.logo} src='/images/ntnui.svg' />
				<Button className={classes.internButton}>INTERN</Button>
			</Box>
			<Box className={classes.formWrapper}>
				<Form />
			</Box>
		</>
	)
}

export default FormBox
