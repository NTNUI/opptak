import { createStyles, Switch } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'tabler-icons-react'
import { toggleAcceptsAdmissions } from '../services/Committees'
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

function CommitteeSwitch({ name, accepts_admissions, slug }: ICommittee) {
	const { classes } = useStyles()
	let navigate = useNavigate()
	const [checked, setChecked] = useState<boolean>(accepts_admissions)
	const [switchStatus, setSwitchStatus] = useState<boolean>(false)
	const committeeNotification = useNotifications()

	/**
	 * On toggle, check input value and compare it to value on server
	 *
	 * If local is not equal to server, then change on server and setChecked with this value
	 * @param event
	 */
	async function handleToggle(event: ChangeEvent<HTMLInputElement>) {
		setChecked(event.currentTarget.checked)
		setSwitchStatus(true)

		try {
			const status = await toggleAcceptsAdmissions(slug)
			setChecked(status)
			setSwitchStatus(false)
		} catch (error: any) {
			if (error.response.status === 401) {
				navigate('/login')
			} else {
				committeeNotification.showNotification({
					title: 'Det skjedde en feil!',
					message:
						'Last inn siden på nytt og prøv igjen. Ta kontakt med sprint@ntnui.no dersom problemet vedvarer',
					color: 'red',
					autoClose: false,
					icon: <AlertTriangle size={18} />,
				})
			}
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
				disabled={switchStatus}
			/>
		</div>
	)
}

export default CommitteeSwitch
