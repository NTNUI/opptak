import { Container, createStyles, Loader } from '@mantine/core'
import axios from 'axios'
import { useEffect, useState } from 'react'
import CommitteeSwitch from '../components/CommitteeSwitch'

import { ICommittee } from '../types/types'

const useStyles = createStyles((theme) => ({
	// modal: {
	// 	border: '1px solid ' + theme.colors.ntnui_yellow[9],
	// 	backgroundColor: theme.colors.ntnui_background[9],
	// },
	container: {
		display: 'flex',
		width: '100%',
		gap: '1rem',
		alignItems: 'center',
		flexDirection: 'column',
		margin: '2rem auto',
		color: 'white',
		borderRadius: '5px',
		h1: {
			margin: 0,
		},
		'@media (max-width: 500px)': {
			width: '90%',
		},
	},
	text: {
		textAlign: 'center',
		width: '60%',

		'@media (max-width: 500px)': {
			width: '90%',
		},
	},
	committeesWrapper: {
		display: 'flex',
		flexDirection: 'column',
		padding: '0.5rem',
		gap: '1rem',
		margin: 'auto',
		width: '60%',
		'@media (max-width: 500px)': {
			width: '90%',
		},
	},
	committees: {
		color: theme.colors.gray[2],
		border: '2px solid #F8F082',
		padding: '0.75rem 1.25rem',
		borderRadius: theme.radius.sm,
		whiteSpace: 'nowrap',
		fontWeight: '300',
		fontSize: 'medium',
		display: 'flex',
		justifyContent: 'space-between',
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
	icons: {},
}))

function AdmissionStatus() {
	const { classes } = useStyles()

	const [committees, setCommittees] = useState<ICommittee[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)

	useEffect(() => {
		setIsLoading(true)
		axios
			.get('/committees')
			.then((res) => {
				setCommittees(res.data)
				setIsLoading(false)
			})
			.catch((error: any) => {
				setIsLoading(false)
			})
	}, [])

	return (
		<>
			<Container className={classes.container}>
				<h1>Opptaksstatus</h1>
				<div className={classes.text}>
					Opptaksstatus avgjør om det skal være mulig for studenter å søke i den
					gitte opptaksperioden DD.MM.YYYY til DD.MM.YYYY
				</div>
				<div className={classes.committeesWrapper}>
					{committees.length ? (
						<Container className={classes.container}>
							{committees.map((item: ICommittee, idx: number) => (
								<CommitteeSwitch key={idx} {...item} />
							))}
						</Container>
					) : isLoading ? (
						<Loader color='yellow' />
					) : (
						<span>No committees found</span>
					)}
				</div>
			</Container>
		</>
	)
}

export default AdmissionStatus
