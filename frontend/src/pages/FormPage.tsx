import { Box, Button, createStyles } from '@mantine/core'
import React from 'react'
import { FileText } from 'tabler-icons-react'
import { Form } from '../components/ApplicationForm'

const useStyles = createStyles((theme) => ({
	formTitleAndBodyWrapper: {
		backgroundColor: '#0a0a0a',
		width: '40%',
		justifyContent: 'center',
		margin: 'auto',
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
		borderRadius: '20px',
		textAlign: 'left',
		color: 'white',
		'@media (max-width: 1200px)': {
			width: '70%',
		},
		'@media (max-width: 700px)': {
			width: '85%',
			border: 'none',
			backgroundColor: 'transparent',
			padding: '1rem',
		},
	},
	header: {
		width: 'auto',
		margin: '2rem 0',
		padding: '0 2rem',
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 3fr 1fr 1fr',
		'@media (max-width: 700px)': {
			gridTemplateColumns: '1fr',
			gridTemplateRows: 'auto 1fr',
			gap: '20px',
		},
	},
	formTitle: {
		fontWeight: 'lighter',
		fontSize: 'x-large',
		textAlign: 'center',
		margin: '1rem auto 0 auto',
		'*': {
			// Icon
			margin: '0 0 -3px 0',
		},
		'@media (max-width: 700px)': {
			fontSize: 'large',
		},
	},
	logo: {
		gridColumn: 3,
		justifySelf: 'center',
		h1: {
			textAlign: 'center',
			color: 'white',
			fontWeight: 'lighter',
			fontSize: 'x-large',
			margin: '-10px 0 0 0',
		},
		img: {
			height: '100px',
		},
		'@media (max-width: 700px)': {
			gridColumn: 1,
			gridRow: 2,
		},
	},
	internButton: {
		justifySelf: 'end',
		fontWeight: 'normal',
		gridColumn: 5,
		'@media (max-width: 700px)': {
			gridColumn: 1,
			gridRow: 1,
		},
	},
}))

function FormBox() {
	const { classes } = useStyles()
	return (
		<>
			<Box className={classes.header}>
				<Box className={classes.logo}>
					<img alt='NTNUI logo' src='/images/ntnui.svg' />
					<h1>OPPTAK</h1>
				</Box>
				<Button uppercase className={classes.internButton}>
					Intern innlogging
				</Button>
			</Box>
			<Box className={classes.formTitleAndBodyWrapper}>
				<h2 className={classes.formTitle}>
					<FileText />
					Søknad til NTNUI Admin
				</h2>
				<Form />
			</Box>
		</>
	)
}

export default FormBox
