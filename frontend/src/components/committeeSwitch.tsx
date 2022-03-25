import { createStyles, Switch } from '@mantine/core'
import axios from 'axios'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
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
	const [committeeStatus, setCommitteeStatus] = useState<boolean>(false)

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
				setCommitteeStatus(status)
				console.log(`${slug} was toggled to ${status}`)
			})
			.catch((err) => {})
	}

	/**
	 * Get committee status from server and set state
	 *
	 * Returns Void
	 */
	const getCommitteeStatus = useCallback(() => {
		axios
			.get('/committees/')
			.then((response) => {
				const data = response.data
				const committee = data.find(
					(committee: { slug: string }) => committee.slug === slug
				)
				setCommitteeStatus(committee.accepts_applicants)
			})
			.catch((error: any) => {
				if (error.response.status !== 200) {
					navigate('/login')
				}
			})
	}, [navigate, slug])

	useEffect(() => {
		getCommitteeStatus() // Get server statuses
		setChecked(committeeStatus) // Sets all committee statuses to match server
	}, [committeeStatus, getCommitteeStatus, checked])

	/**
	 * On toggle, check input value and compare it to value on server
	 *
	 * If local is not equal to server, then change on server and setChecked with this value
	 * @param event
	 */
	function handleToggle(event: ChangeEvent<HTMLInputElement>) {
		getCommitteeStatus()
		if (event.currentTarget.checked !== committeeStatus) {
			toggleAcceptApplicationsAsync()
			setChecked(committeeStatus)
		}
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
