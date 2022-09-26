import { Button, createStyles, Loader, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { DateRangePicker } from '@mantine/dates'
import 'dayjs/locale/nb'
import { Calendar, Check, History, X } from 'tabler-icons-react'
import {
	getAdmissionPeriod,
	putAdmissionPeriod,
} from '../services/Applications'
import { IAdmissionPeriod } from '../types/types'
import dayjs from 'dayjs'
import { useNotifications } from '@mantine/notifications'

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
			margin: '1rem 0 0 0',
		},
		p: {
			margin: '10px 0 0 0',
		},
	},
	admissionPeriodStatusText: {
		fontWeight: 'lighter',
		b: {
			color: theme.colors.ntnui_yellow[9],
		},
	},
	loaderWrapper: {
		alignSelf: 'center',
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

interface stateType {
	isOrganizer: boolean
}

function AdmissionPeriod() {
	const { classes } = useStyles()
	const navigate = useNavigate()
	const location = useLocation()
	const notifications = useNotifications()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	// Has period been set in the db before
	const [isPeriodSet, setIsPeriodSet] = useState<boolean>(false)
	// Save previous dates to allow resetting
	const today = dayjs(new Date()).startOf('day')
	const [previousDates, setPreviousDates] = useState<Date[]>([
		today.toDate(),
		today.add(7, 'day').toDate(),
	])
	// Is period different from what is in db
	const [differentFromDb, setChanged] = useState<boolean>(false)
	const [hasError, setHasError] = useState<boolean>(false)
	const [initialChange, setHasInitialChange] = useState<boolean>(false)
	const [setBy, setSetBy] = useState<string>('')
	const [updatedDateValue, setUpdatedDateValue] = useState<Date>()

	const form = useForm({
		initialValues: {
			dateRangeInput: [previousDates[0], previousDates[1]],
		},
		validate: {
			dateRangeInput: (value) =>
				!value[0] || !value[1] ? 'Du må velge to datoer' : null,
		},
	})

	useEffect(() => {
		setIsLoading(true)
		const getAdmissionPeriodAsync = async () => {
			try {
				// If not organizer, redirect to dashboard
				const locationState = location.state as stateType
				if (!locationState.isOrganizer) {
					navigate('/dashboard')
					return
				}
				const response = await getAdmissionPeriod()
				const retrievedPeriod = [
					new Date(response.admissionPeriod.start_date),
					new Date(response.admissionPeriod.end_date),
				]
				setSetBy(response.admissionPeriod.set_by)
				setUpdatedDateValue(response.admissionPeriod.updated_date)
				form.setValues({ dateRangeInput: retrievedPeriod })
				setPreviousDates(retrievedPeriod)
				setIsPeriodSet(true)
				setIsLoading(false)
				setHasInitialChange(false)
			} catch (error: any) {
				if (error.response.status === 401) {
					navigate('/login')
				} else if (error.response.status !== 404) {
					notifications.showNotification({
						loading: false,
						color: 'red',
						icon: <X size={18} />,
						title: 'En feil oppstod',
						message: 'Kunne ikke hente opptaksperioden',
						autoClose: false,
					})
				}
				setIsLoading(false)
			}
		}
		getAdmissionPeriodAsync()
	}, [navigate])

	const saveAdmissionPeriod = () => {
		if (!form.validate().hasErrors) {
			const start = form.values.dateRangeInput[0]
			const end = form.values.dateRangeInput[1]
			const admissionPeriod: IAdmissionPeriod = {
				start_date: dayjs(start).format('YYYY-MM-DD'),
				end_date: dayjs(end).format('YYYY-MM-DD'),
			}
			const id = notifications.showNotification({
				loading: true,
				color: 'green',
				icon: <Check size={18} />,
				title: 'Oppdaterer opptaksperiode',
				message: '',
				autoClose: false,
			})
			putAdmissionPeriod(admissionPeriod)
				.then((response) => {
					setChanged(false)
					setIsPeriodSet(true)
					setPreviousDates([start, end])
					setSetBy(response.admissionPeriod.set_by)
					setUpdatedDateValue(response.admissionPeriod.updated_date)
					notifications.updateNotification(id, {
						id,
						loading: false,
						color: 'green',
						icon: <Check size={18} />,
						title: `Opptaksperiode ${isPeriodSet ? 'oppdatert' : 'satt'}!`,
						message: '',
						autoClose: 7000,
					})
				})
				.catch((err) => {
					let title = ''
					let message = ''
					// Set error message content based on error-type
					if (err.response.status === 403) {
						title = 'Du har ikke tilgang til å endre opptaksperioden!'
						message = 'Du må være i Hovedstyret for å kunne endre opptaksperioden'
					} else {
						title = 'En feil oppstod!'
						message = 'Kunne ikke oppdatere opptaksperioden'
					}
					notifications.updateNotification(id, {
						id: id,
						loading: false,
						color: 'red',
						icon: <X size={18} />,
						title: title,
						message: message,
						autoClose: false,
					})
				})
		}
	}

	const undoChanges = () => {
		form.setValues({ dateRangeInput: [previousDates[0], previousDates[1]] })
	}

	useEffect(() => {
		setHasInitialChange(true)
	}, [form.values.dateRangeInput])

	useEffect(() => {
		// Check if dates are different than what is saved in db
		if (
			dayjs(form.values.dateRangeInput[0]).isSame(previousDates[0]) &&
			dayjs(form.values.dateRangeInput[1]).isSame(previousDates[1])
		) {
			if (differentFromDb) setChanged(false)
		} else {
			if (!differentFromDb) setChanged(true)
		}
		// Check error state
		setHasError(form.validate().hasErrors)
	}, [form.values.dateRangeInput, previousDates])

	const admissionPeriodStatusText = isPeriodSet ? (
		<>
			Lagret opptaksperiode <br />
			<b>
				{previousDates[0]?.toLocaleDateString('no-No', {
					month: '2-digit',
					day: '2-digit',
					year: '2-digit',
				})}
				-
				{previousDates[1]?.toLocaleDateString('no-No', {
					month: '2-digit',
					day: '2-digit',
					year: '2-digit',
				})}
			</b>
		</>
	) : (
		<>Det er ikke satt noen opptaksperiode enda.</>
	)

	return (
		<div className={classes.pageWrapper}>
			<div className={classes.header}>
				<h1>Opptaksperiode</h1>
				<p>
					Opptaksperioden bestemmer når studenter har mulighet til å sende inn
					søknad.
				</p>
				<h3 className={classes.admissionPeriodStatusText}>
					{admissionPeriodStatusText}
				</h3>
			</div>
			{isLoading ? (
				<div className={classes.loaderWrapper}>
					<Loader color='yellow' variant='dots' />
				</div>
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
					description={
						setBy &&
						updatedDateValue &&
						`Satt av ${setBy} ${dayjs(updatedDateValue)
							.locale('nb')
							.format('D. MMM HH:mm')}`
					}
					{...form.getInputProps('dateRangeInput')}
					onBlur={() => form.validateField('dateRangeInput')}
				/>
			)}
			{isPeriodSet && !differentFromDb && initialChange && (
				<i className={classes.unchangedText}>Endre opptaksperioden for å lagre</i>
			)}
			<div className={classes.buttonWrapper}>
				<Button
					disabled={isPeriodSet && !differentFromDb}
					className={classes.cancelButton}
					leftIcon={<History />}
					onClick={undoChanges}
				>
					Fjern endringer
				</Button>
				<Button
					className={classes.confirmButton}
					disabled={(isPeriodSet && !differentFromDb) || hasError}
					leftIcon={<Check />}
					onClick={saveAdmissionPeriod}
				>
					{isPeriodSet ? 'Oppdater' : 'Lagre'}
				</Button>
			</div>
		</div>
	)
}

export default AdmissionPeriod
