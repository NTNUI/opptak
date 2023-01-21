import { createStyles } from '@mantine/core'
import { useContext, useMemo } from 'react'
import { ArrowRight, Phone } from 'tabler-icons-react'
import { FilterContext, UserContext } from '../pages/ApplicationOverview'
import { IApplication, ICommittee } from '../types/types'
import { REACT_APP_MAIN_BOARD_ID } from '../utils/constants'
import NTNUICopyButton from './NTNUICopyButton'
import StatusInput from './StatusInput'

interface IApplicationOverviewStyleProps {
	idx: number
}

const useStyles = createStyles(
	(theme, { idx }: IApplicationOverviewStyleProps) => ({
		grid: {
			display: 'grid',
			alignItems: 'center',
			backgroundColor: idx % 2 === 0 ? '#F8F0820F' : 'none',
			whiteSpace: 'nowrap',
			fontWeight: 300,
			fontSize: 'medium',
			padding: '0 1em',
			margin: '0.1rem',
			gap: theme.spacing.sm,
			gridTemplateColumns:
				'minmax(0,1fr) minmax(0,4fr) minmax(0,4fr) minmax(0,4fr)',
			'@media (max-width: 900px)': {
				padding: '0',
				gridTemplateColumns: 'minmax(0,4fr) minmax(0,4fr)',
			},
		},
		nameButton: {
			border: 'none',
			color: 'inherit',
			fontFamily: 'inherit',
			fontSize: 'inherit',
			fontWeight: 'inherit',
			backgroundColor: 'transparent',
			padding: theme.spacing.md,
			cursor: 'pointer',
			transition: 'ease-in-out 0.1s',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			svg: {
				// Arrow icon
				transition: 'transform ease-in-out 0.2s',
				opacity: 0.1,
			},
			span: {
				overflow: 'hidden',
				textOverflow: 'ellipsis',
			},
			'&:hover': {
				backgroundColor: '#F8F0822D',
				color: '#F8F082',
				svg: {
					opacity: 1,
					transform: 'translateX(0.4em)',
				},
			},
			'@media (max-width: 900px)': {
				svg: {
					display: 'none',
				},
			},
		},
		emailDiv: {
			display: 'flex',
			alignItems: 'center',
			span: {
				overflow: 'hidden',
				textOverflow: 'ellipsis',
			},
			'@media (max-width: 900px)': {
				display: 'none',
			},
		},
		phoneNumberDiv: {
			display: 'flex',
			alignItems: 'center',
			color: theme.colors.ntnui_yellow[9],
			a: {
				color: theme.colors.ntnui_yellow[9],
				textDecoration: 'none',
				marginLeft: '0.2rem',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
			},
			'@media (min-width: 900px)': {
				display: 'none',
			},
		},
		committeeDiv: {
			borderLeft: '1px solid #F8F082',
			paddingLeft: '1rem',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			'@media (max-width: 900px)': {
				display: 'none',
			},
		},
		badgeDiv: {
			display: 'flex',
			userSelect: 'none',
			alignContent: 'center',
			color: theme.colors.ntnui_yellow[9],
			'@media (max-width: 900px)': {
				display: 'none',
			},
		},
		statusDiv: {
			'@media (max-width: 900px)': {
				display: 'none',
			},
		},
		date: {
			color: theme.colors.ntnui_yellow[9],
			whiteSpace: 'nowrap',
			'@media (max-width: 500px)': {
				fontSize: 'medium',
			},
			'@media (min-width: 500px)': {
				fontSize: 'medium',
			},
		},
	})
)

interface IApplicationItem extends IApplication {
	idx: number
	handleClick(id: string): void
}
function ApplicationItem({
	_id,
	idx,
	name,
	email,
	phone_number,
	committees,
	statuses,
	submitted_date,
	handleClick,
}: IApplicationItem) {
	const { classes } = useStyles({ idx })

	const { userRoleInCommittees, isInElectionCommittee } = useContext(UserContext)
	const { chosenCommittees } = useContext(FilterContext)

	const date = new Date(submitted_date)

	const submittedDate = date.toLocaleDateString('en-GB', {
		month: 'short',
		day: '2-digit',
	})

	const stringifyCommittees = (committees: ICommittee[]) => {
		if (committees.length) {
			const committeeNames = committees.map((committee) => committee.name)
			return committeeNames.reduce((left, right) => {
				return left + ', ' + right
			})
		} else {
			return 'N/A'
		}
	}

	const stringifiedCommittees = useMemo(
		() => stringifyCommittees(committees),
		[committees]
	)

	return (
		<div className={classes.grid}>
			<div className={classes.badgeDiv}>
				<span className={classes.date}>{submittedDate.toUpperCase()}</span>
			</div>
			<button className={classes.nameButton} onClick={() => handleClick(_id)}>
				<span>{name}</span>
				<ArrowRight size={20} />
			</button>
			<div className={classes.emailDiv}>
				<span>{email}</span>
				<NTNUICopyButton value={email} />
			</div>
			<div className={classes.phoneNumberDiv}>
				<Phone size={16} />
				<a href={`tel:${phone_number}`}>{phone_number}</a>
			</div>
			<div className={classes.statusDiv}>
				{chosenCommittees.length === 1 ? (
					statuses
						.filter((status) => status.committee === Number(chosenCommittees[0]))
						.map((status) => (
							<StatusInput
								variant='simple'
								key={status.committee}
								value={status.value}
								set_by={''}
								updated_date={status.updated_date}
								allowedToChange={userRoleInCommittees.some((userRoleInCommittee) => {
									const isStatusForMainBoard =
										status.committee === REACT_APP_MAIN_BOARD_ID
									return (
										userRoleInCommittee.committee._id === status.committee ||
										(isInElectionCommittee && isStatusForMainBoard)
									)
								})}
								_id={status._id}
							/>
						))
				) : (
					<div id='committee' className={classes.committeeDiv}>
						{stringifiedCommittees}
					</div>
				)}
			</div>
		</div>
	)
}

export default ApplicationItem
