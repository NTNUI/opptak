import {
	createStyles,
	Group,
	Loader,
	MantineTheme,
	Select,
} from '@mantine/core'
import axios from 'axios'
import { forwardRef } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDown } from 'tabler-icons-react'

import StatusTypes from '../utils/enums'
import {
	getIconForStatus,
	getStatusColor,
	getStatusTranslation,
} from '../utils/status'

export interface IStatusInputProps {
	_id: string
	value: StatusTypes
	set_by: string | null
	committee: {
		name: string
		_id: number
	}
	updated_date: Date
	allowedToChange: boolean
}

interface IStatusStyleProps {
	statusValue: StatusTypes
}

const useStyles = createStyles((theme, { statusValue }: IStatusStyleProps) => ({
	root: {},
	label: {
		color: 'white',
		wordBreak: 'break-word',
	},
	input: {
		backgroundColor: getStatusColor(statusValue, theme),
		border: 0,
		color: isYellow(statusValue) ? 'black' : 'white',
		':disabled': {
			opacity: 1,
			backgroundColor: getStatusColor(statusValue, theme),
			color: isYellow(statusValue) ? 'black' : 'white',
		},
	},
	rightSection: {
		color: isYellow(statusValue) ? 'black' : 'white',
		pointerEvents: 'none',
	},
	icon: {
		color: isYellow(statusValue) ? 'black' : 'white',
	},

	description: {},
}))

function isYellow(value: StatusTypes): boolean {
	// The following status-types are yellow
	return (
		value === StatusTypes.INVITED_TO_INTERVIEW ||
		value === StatusTypes.OFFER_GIVEN ||
		value === StatusTypes.INTERVIEW_COMPLETED
	)
}

function StatusInput({
	_id,
	value,
	set_by,
	committee,
	updated_date,
	allowedToChange,
}: IStatusInputProps) {
	const [statusValue, setStatusValue] = useState<StatusTypes>(value)
	const [setByValue, setSetByValue] = useState<string | null>(set_by)
	const [updatedDateValue, setUpdatedDateValue] = useState<Date>(updated_date)
	const { classes } = useStyles({ statusValue })
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const StatusOptions = () => {
		return Object.values(StatusTypes).map((status: StatusTypes) => {
			return {
				value: status,
				label: `${getStatusTranslation(status)}`,
			}
		})
	}

	async function postStatus(newValue: StatusTypes) {
		if (newValue !== statusValue) {
			setIsLoading(true)
			await axios
				.put(`/statuses/${_id}`, {
					value: newValue,
				})
				.then((res) => {
					setIsLoading(false)
					const newStatus = res.data.status
					setUpdatedDateValue(newStatus.updated_date)
					setSetByValue(newStatus.set_by)
				})
				.catch((err) => {
					setIsLoading(false)
					console.log(err)
				})
		}
	}

	interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
		label: string
		value: StatusTypes
	}

	const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
		({ label, value, ...others }: ItemProps, ref) => (
			<div ref={ref} {...others}>
				<Group noWrap>
					{getIconForStatus(value)}
					{label}
				</Group>
			</div>
		)
	)

	return (
		<>
			<Select
				label={committee.name}
				description={
					setByValue &&
					`Satt av ${setByValue} ${new Date(updatedDateValue).toLocaleString(
						'no-NO',
						{
							month: 'short',
							day: '2-digit',
							year: '2-digit',
							hour: 'numeric',
							minute: 'numeric',
						}
					)}`
				}
				disabled={!allowedToChange || isLoading}
				placeholder='Pick one'
				rightSection={
					allowedToChange ? <ChevronDown size={20} /> : <ChevronDown size={0} />
				}
				rightSectionWidth={40}
				defaultValue={statusValue}
				value={statusValue}
				itemComponent={SelectItem}
				icon={getIconForStatus(statusValue)}
				classNames={{
					root: classes.root,
					description: classes.description,
					label: classes.label,
					icon: classes.icon,
					input: classes.input,
					rightSection: classes.rightSection,
				}}
				onChange={(e) => {
					setStatusValue(e as StatusTypes)
					postStatus(e as StatusTypes)
				}}
				data={StatusOptions()}
			/>
		</>
	)
}

export default StatusInput
