import { Button, createStyles } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { DateRangePicker } from '@mantine/dates'
import 'dayjs/locale/nb'
import { Calendar, X, Check } from 'tabler-icons-react'

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
		backgroundColor: theme.colors.ntnui_red[9],
		transition: '0.3s',
		border: '2px solid' + theme.colors.ntnui_red[9],
		':hover': {
			border: '2px solid' + theme.colors.ntnui_red[9],
			color: theme.colors.ntnui_red[9],
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
	const [previousDates, setPreviousDates] = useState<(Date | null)[]>([
		null,
		null,
	])
	const [changed, setChanged] = useState(false)
	const today = new Date()

	const form = useForm({
		initialValues: {
			datePeriod: [
				new Date(),
				new Date(today.getTime() + 432000000), // Today + 5 days
			],
		},
		validate: {
			datePeriod: (value) =>
				!value[0] || !value[1] ? 'Du må velge en tidsperiode' : null,
		},
	})

	useEffect(() => {
		setPreviousDates([new Date(), new Date()])
		// TODO: getApplicationPeriod - if 401 redirect
	}, [navigate])
	// Start-dato må være på 0000 slutt-dato må være 23.59

	useEffect(() => {
		if (form.values.datePeriod !== previousDates) {
			setChanged(true)
		}
		console.log('Change')
	}, [form.values.datePeriod])

	return (
		<div className={classes.pageWrapper}>
			<div className={classes.header}>
				<h1>Opptaksperiode</h1>
				<p>
					Opptaksperioden bestemmer når studenter har mulighet til å sende inn søknad
				</p>
			</div>
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
				{...form.getInputProps('datePeriod')}
				onBlur={() => form.validateField('datePeriod')}
			/>
			{!changed && (
				<i className={classes.unchangedText}>Opptaksperioden er uendret</i>
			)}
			<div className={classes.buttonWrapper}>
				<Button className={classes.cancelButton} leftIcon={<X />}>
					Avbryt
				</Button>
				<Button
					className={classes.confirmButton}
					disabled={!changed}
					leftIcon={<Check />}
				>
					Lagre
				</Button>
			</div>
		</div>
	)
}

export default ApplicationPeriod
