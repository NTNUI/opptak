import { createStyles, Switch } from '@mantine/core'
import axios from 'axios'
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ICommittee } from '../types/types'

const useStyles = createStyles((theme) => ({
	committees: {
		color: theme.colors.gray[2],
		border: '2px solid' + theme.colors.ntnui_yellow[9],
		padding: '0.75rem 1.25rem',
		borderRadius: theme.radius.sm,
		whiteSpace: 'nowrap',
		fontWeight: '300',
		fontSize: 'medium',
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
		boxShadow: '0rem 0.2rem 0.4rem ' + theme.colors.dark[7],
	},
	switch: {
		input: {
			background: theme.colors.ntnui_red[9],
			border: 'none',
			'&:checked': {
				background: theme.colors.ntnui_green[9],
			},
		},
	},
}))

function CommitteeSwitch({ name, accepts_applicants, slug }: ICommittee) {
	const { classes } = useStyles()
	let navigate = useNavigate()
	const [checked, setChecked] = useState<boolean>(accepts_applicants)

	/**
	 * Toggles if the committee is open on server
	 *
	 * Set new status
	 *
	 * Returns Void
	 */
	const toggleAcceptApplicationsAsync = async () => {
		axios
			.put(`/committees/${slug}/accept-applicants`)
			.then((response) => {
				const status = response.data.accept_applicants
				setChecked(status)
				console.log(`${slug} was toggled to ${status}`)
			})
			.catch((err) => {
				navigate('/login')
			})
	}

	useEffect(() => {
		setChecked(accepts_applicants)
	}, [])

	/**
	 * On toggle, check input value and compare it to value on server
	 *
	 * If local is not equal to server, then change on server and setChecked with this value
	 * @param event
	 */
	async function handleToggle(event: ChangeEvent<HTMLInputElement>) {
		setChecked(event.currentTarget.checked)
		await toggleAcceptApplicationsAsync()
	}

	return (
		<div className={classes.committees}>
			<div>{name}</div>
			<Switch
				className={classes.switch}
				checked={checked}
				onChange={(event) => handleToggle(event)}
				size='md'
				radius='lg'
			/>
		</div>
	)
}

export default CommitteeSwitch
