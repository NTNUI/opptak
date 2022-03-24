import { Button, createStyles, Loader } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { DateRangePicker } from '@mantine/dates'
import 'dayjs/locale/nb'
import { Calendar, Check, History } from 'tabler-icons-react'
import {
	getApplicationPeriod,
	putApplicationPeriod,
} from '../services/Applications'
import { IApplicationPeriod } from '../types/types'
import dayjs from 'dayjs'

const useStyles = createStyles((theme) => ({
	pageWrapper: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		margin: 'auto',
		width: '400px',
		color: 'white',
		'@media (max-width: 400px)': {
			fontSize: 'small',
			width: '90%',
		},
	},
	header: {
		textAlign: 'center',
		h1: {
			fontWeight: 'lighter',
		},
	},
	dateRangeInput: {
		backgroundColor: 'transparent',
		color: 'white',
		border: '2px solid ' + theme.colors.ntnui_yellow[9],
	},
	dateRangeError: {
		margin: 0,
		position: 'absolute',
	},
	dateRangeLabel: {
		textAlign: 'left',
		color: 'white',
	},
	dateRangeIcon: {
		color: theme.colors.ntnui_yellow[9],
	},
	unchangedText: {
		color: theme.colors.ntnui_yellow[9],
		fontSize: '0.8rem',
	},
	dateRangeRightSection: {
		button: {
			color: theme.colors.ntnui_yellow[9],
		},
	},
	buttonWrapper: {
		margin: '30px 0 5px 0',
		width: '100%',
		display: 'flex',
		gap: '10px',
	},
	cancelButton: {
		width: '100%',
		backgroundColor: theme.colors.ntnui_blue[9],
		transition: '0.3s',
		border: '2px solid' + theme.colors.ntnui_blue[9],
		':hover': {
			border: '2px solid' + theme.colors.ntnui_blue[9],
			color: theme.colors.ntnui_blue[9],
			backgroundColor: 'transparent',
		},
	},
	confirmButton: {
		width: '100%',
		backgroundColor: theme.colors.ntnui_green[9],
		transition: '0.3s',
		border: '2px solid' + theme.colors.ntnui_green[9],
		':hover': {
			border: '2px solid' + theme.colors.ntnui_green[9],
			color: theme.colors.ntnui_green[9],
			backgroundColor: 'transparent',
		},
	},
}))

function ApplicationPeriod() {
	const { classes } = useStyles()
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(false)
	// Has period been set in the db before
	const [isPeriodSet, setisPeriodSet] = useState(false)
	// Save previous dates to allow resetting
	const today = new Date()
	const [previousDates, setPreviousDates] = useState<Date[]>([
		new Date(),
		new Date(today.getTime() + 432000000),
	])
	const [changed, setChanged] = useState<boolean>(false)

	const form = useForm({
		initialValues: {
			dateRangeInput: [new Date(), new Date()],
		},
		validate: {
			dateRangeInput: (value) =>
				!value[0] || !value[1] ? 'Du må velge to datoer' : null,
		},
	})

	useEffect(() => {
		setIsLoading(true)
		const getApplicationPeriodAsync = async () => {
			try {
				const response = await getApplicationPeriod()
				const retrievedPeriod = [
					new Date(response.applicationPeriod.start_date),
					new Date(response.applicationPeriod.end_date),
				]
				setPreviousDates(retrievedPeriod)
				form.setValues({ dateRangeInput: retrievedPeriod })
				setIsLoading(false)
				setisPeriodSet(true)
			} catch (error: any) {
				setIsLoading(false)
				if (error.response.status === 403) {
					console.log('Unauthorized')
					// TODO: Inform user that is not authorized
				} else if (error.response.status === 404) {
					// TODO: Application period not set
				} else {
					navigate('/login')
				}
			}
		}
		getApplicationPeriodAsync()
	}, [navigate])

	const saveApplicationPeriod = () => {
		if (!form.validate().hasErrors) {
			const start = form.values.dateRangeInput[0]
			const end = form.values.dateRangeInput[1]
			const applicationPeriod: IApplicationPeriod = {
				start_date: dayjs(start).toString(),
				end_date: dayjs(end).toString(),
			}
			putApplicationPeriod(applicationPeriod)
				.then(() => {
					// TODO: Show success-notification
					setChanged(false)
					setisPeriodSet(true)
					setPreviousDates([start, end])
				})
				.catch((err) => {
					// TODO: Show error-notification
					console.log(err)
				})
		}
	}

	const undoChanges = () => {
		form.setValues({ dateRangeInput: [previousDates[0], previousDates[1]] })
	}

	useEffect(() => {
		// Check if dates are different than what is saved in db
		setChanged(false)
		if (form.values.dateRangeInput[0] && form.values.dateRangeInput[1]) {
			if (
				!dayjs(form.values.dateRangeInput[0]).isSame(previousDates[0]) ||
				!dayjs(form.values.dateRangeInput[1]).isSame(previousDates[1])
			) {
				setChanged(true)
			}
		} else {
			setChanged(true)
		}
	}, [form.values.dateRangeInput, previousDates])

	const applicationPeriodStatusText = isPeriodSet
		? `Opptaksperioden er satt fra ${previousDates[0]?.toLocaleDateString(
				'no-No',
				{
					month: 'long',
					day: '2-digit',
					year: 'numeric',
				}
		  )} til ${previousDates[1]?.toLocaleDateString('no-No', {
				month: 'long',
				day: '2-digit',
				year: 'numeric',
		  })}`
		: 'Det er ikke satt noen opptaksperiode enda'

	return (
		<div className={classes.pageWrapper}>
			<div className={classes.header}>
				<h1>Opptaksperiode</h1>
				<p>
					Opptaksperioden bestemmer når studenter har mulighet til å sende inn søknad
				</p>
				<p>{applicationPeriodStatusText}</p>
			</div>
			{isLoading ? (
				<Loader color='yellow' variant='dots' />
			) : (
				<DateRangePicker
					locale='nb'
					amountOfMonths={1}
					icon={<Calendar />}
					closeCalendarOnChange={false}
					classNames={{
						input: classes.dateRangeInput,
						label: classes.dateRangeLabel,
						icon: classes.dateRangeIcon,
						error: classes.dateRangeError,
						rightSection: classes.dateRangeRightSection,
					}}
					label='Opptaksperiode'
					placeholder='Velg en tidsperiode'
					{...form.getInputProps('dateRangeInput')}
					onBlur={() => form.validateField('dateRangeInput')}
				/>
			)}
			{isPeriodSet && !changed && (
				<i className={classes.unchangedText}>Endre opptaksperioden for å lagre</i>
			)}
			<div className={classes.buttonWrapper}>
				<Button
					disabled={isPeriodSet && !changed}
					className={classes.cancelButton}
					leftIcon={<History />}
					onClick={undoChanges}
				>
					Fjern endringer
				</Button>
				<Button
					className={classes.confirmButton}
					disabled={isPeriodSet && !changed}
					leftIcon={<Check />}
					onClick={saveApplicationPeriod}
				>
					Lagre
				</Button>
			</div>
		</div>
	)
}

export default ApplicationPeriod
