import { createStyles } from '@mantine/core'
import React from 'react'

const useStyles = createStyles((theme) => ({
	logo: {
		height: '100px',
		margin: 'auto',
	},
	imagewrapper: {
		display: 'flex',
		padding: '1rem',
	},
}))

export interface ImageProp {
	image?: String
}

export function DisplayLogo(props: ImageProp) {
	const { classes } = useStyles()
	return (
		<div className={classes.imagewrapper}>
			<img alt='NTNUIlogo' className={classes.logo} src='/images/ntnui.svg' />
		</div>
	)
}
