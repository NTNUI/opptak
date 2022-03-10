import { Notification } from '@mantine/core'
import { render } from '@testing-library/react'
import { useState } from 'react'
import { X, Check } from 'tabler-icons-react'

export function ErrorNotification() {
	const [close, setClosed] = useState(false)
	render(
		<>
			<Notification
				icon={<X size={18} />}
				color='red'
				onClose={() => setClosed(true)}
			>
				Kunne ikke hente komiteer!
			</Notification>
		</>
	)
}

export function SuccessNotification() {
	const [close, setClosed] = useState(false)
	return(
		<>
			<Notification
				icon={<Check size={18} />}
				color='green'
				onClose={() => setClosed(true)}
			>
				Takk for din søknad!
			</Notification>
		</>
	)
}
