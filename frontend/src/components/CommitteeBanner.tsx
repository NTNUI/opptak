import { Box, MediaQuery, createStyles } from '@mantine/core'
import { AlertTriangle } from 'tabler-icons-react'
import { ICommittee } from 'types/types'

const useStyles = createStyles((theme) => ({
	banner: {
		boxSizing: 'border-box',
		backgroundColor: theme.colors.orange[5] + '1A',
		border: '2px solid ' + theme.colors.orange[5],
		borderRadius: theme.radius.sm,
		width: '60%',
		margin: 'auto auto 15px auto',
		padding: '0.7rem 0.5rem',
		color: 'white',
		display: 'grid',
		gridTemplateColumns: 'auto 1fr',
		gridTemplateRows: 'auto 1fr',
		gridTemplateAreas: `
        'icon title'
        'icon description'
    `,
		h3: {
			fontWeight: 'lighter',
			gridArea: 'title',
			margin: '0 0 0 10px',
		},
		p: {
			gridArea: 'description',
			margin: '0 0 0 10px',
		},
		svg: {
			gridArea: 'icon',
			alignSelf: 'center',
			color: theme.colors.orange[5],
			margin: '0 0 -7px 0',
		},
		'@media (max-width: 1200px)': {
			width: '70%',
		},
		'@media (max-width: 700px)': {
			width: '85%',
			padding: '5px',
			borderWidth: '2px 0 2px 0',
			'p, h3': {
				margin: '0',
			},
			h3: {
				overflow: 'hidden',
				whiteSpace: 'nowrap',
				textOverflow: 'ellipsis',
			},
			svg: {
				display: 'none',
			},
		},
	},
}))

interface ICommitteeBannerProps {
	committees: ICommittee[]
}

const CommitteeBanner = ({ committees }: ICommitteeBannerProps) => {
	const { classes } = useStyles()
	function stringifyCommittees(
		committees: ICommittee[],
		maxNum: number
	): string {
		if (committees.length > maxNum) {
			return `${committees[0].name} og ${committees.length - 1} andre utvalg`
		}
		return committees
			.map((committee) => committee.name)
			.reduce((left, right, idx) =>
				idx === committees.length - 1 ? left + ' og ' + right : left + ', ' + right
			)
	}
	return (
		<>
			<Box className={classes.banner}>
				<AlertTriangle size={55} />
				<MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
					<h3>{`Søker ${stringifyCommittees(committees, 4)}`}</h3>
				</MediaQuery>
				<MediaQuery largerThan='sm' styles={{ display: 'none' }}>
					<h3>{`Søker ${stringifyCommittees(committees, 3)}`}</h3>
				</MediaQuery>
				<p>Koordiner for å unngå å konkurrere internt</p>
			</Box>
		</>
	)
}

export default CommitteeBanner
