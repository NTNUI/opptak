import { Button, createStyles } from '@mantine/core'

import React from 'react'

const useStyles = createStyles((theme) => ({
	select: {
		position: 'absolute',
		left: '90%',
		top: '5%',
	},
}))

export function InternButton() {
	const { classes } = useStyles()
	return (
		<Button className={classes.select} size='lg'>
			Intern
		</Button>
	)
}
;<Button size='lg'>Intern</Button>
