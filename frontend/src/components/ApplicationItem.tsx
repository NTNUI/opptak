import { createStyles, MediaQuery } from '@mantine/core'
import { useMemo } from 'react'
import { IApplication, ICommittee } from '../types/types'
import StatusInput from './StatusInput'

interface IApplicationOverviewStyleProps {
	idx: number
}

const useStyles = createStyles(
	(theme, { idx }: IApplicationOverviewStyleProps) => ({
		box: {
			color: theme.colors.gray[2],
			textAlign: 'left',
			border: '0px solid #F8F082',
			padding: theme.spacing.sm,
			borderRadius: theme.radius.sm,
			cursor: 'pointer',
			display: 'flex',
			alignItems: 'center',
			flexDirection: 'row',
			gap: '0.5rem',
			transition: 'ease-in-out 0.1s',
			backgroundColor: idx % 2 === 0 ? '#F8F0820F' : 'transparent',
			'&:hover': {
				backgroundColor: '#F8F0822D',
				color: '#F8F082',
			},
			'&:active': {
				color: '#F8F082',
				boxShadow: '0 0 2px #F8F082',
			},
		},
		grid: {
			marginLeft: '0',
			flexGrow: '3',
			whiteSpace: 'nowrap',
			fontWeight: '300',
			fontSize: 'medium',
			display: 'grid',
			gap: '1em',
			'@media (max-width: 1200px)': {
				gridTemplateColumns: '6fr 10fr 10fr',
			},
			gridTemplateColumns: '1fr 5fr 5fr 4fr',
		},
		nameDiv: {
			textAlign: 'left',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
		},
		committeeDiv: {
			p: {
				margin: '0',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
			},
			minWidth: '4rem',
			borderLeft: '1px solid #F8F082',
			paddingLeft: '1rem',
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
			justifyContent: 'space-between',
		},
		emailDiv: {
			textOverflow: 'ellipsis',
			minWidth: '5em',
			overflow: 'hidden',
			alignSelf: 'left',
		},
		dateBadgeDiv: {
			display: 'flex',
			alignContent: 'center',
			color: theme.colors.ntnui_yellow[9],
		},
		date: {
			color: theme.colors.ntnui_yellow[9],
			whiteSpace: 'nowrap',
			margin: 0,
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
	committees,
	statuses,
	submitted_date,
	handleClick,
}: IApplicationItem) {
	const { classes } = useStyles({ idx })

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
		<div className={classes.box}>
			<div className={classes.grid}>
				<div className={classes.dateBadgeDiv}>
					<span className={classes.date}>{submittedDate.toUpperCase()}</span>
				</div>
				<div onClick={() => handleClick(_id)} className={classes.nameDiv}>
					{name}
				</div>
				<MediaQuery query='(max-width: 1200px)' styles={{ display: 'none' }}>
					<div className={classes.emailDiv}>{email}</div>
				</MediaQuery>
				{statuses.length === 1 ? (
					<>
						<MediaQuery query='(max-width: 1200px)' styles={{ display: 'none' }}>
							<div className={classes.committeeDiv}>
								<p>{committees[0].name}</p>
								<StatusInput {...statuses[0]} allowedToChange={true} />
							</div>
						</MediaQuery>
						<MediaQuery query='(min-width: 1200px)' styles={{ display: 'none' }}>
							<div id='committee' className={classes.committeeDiv}>
								<p>{stringifiedCommittees}</p>
							</div>
						</MediaQuery>
					</>
				) : (
					<div id='committee' className={classes.committeeDiv}>
						<p>{stringifiedCommittees}</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default ApplicationItem
