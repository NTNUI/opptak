import { MantineTheme } from '@mantine/core'
import { StatusTypes } from './enums'
import {
	Check,
	ClipboardText,
	Clock,
	File,
	PhoneCheck,
	PhoneIncoming,
	PhoneOff,
	PhonePause,
	QuestionMark,
	UserOff,
	UserPlus,
	X,
} from 'tabler-icons-react'

export function getStatusTranslation(status: StatusTypes) {
	switch (status) {
		case StatusTypes.PENDING:
			return 'Ubehandlet'
		case StatusTypes.PLANNED_INTERVIEW:
			return 'Planlagt intervju'
		case StatusTypes.INVITED_TO_INTERVIEW:
			return 'Invitert til intervju'
		case StatusTypes.INTERVIEW_DECLINED:
			return 'Intervju avslått'
		case StatusTypes.INTERVIEW_COMPLETED:
			return 'Intervju fullført'
		case StatusTypes.UNCERTAIN:
			return 'Under vurdering'
		case StatusTypes.PLANNED_ACCEPTANCE:
			return 'Planlagt tilbud'
		case StatusTypes.PLANNED_REJECTION:
			return 'Planlagt avslag'
		case StatusTypes.OFFER_GIVEN:
			return 'Tilbud gitt'
		case StatusTypes.OFFER_DECLINED:
			return 'Tilbud avslått'
		case StatusTypes.ACCEPTED:
			return 'Akseptert'
		case StatusTypes.REJECTED:
			return 'Avvist'
		default:
			return 'Ukjent status'
	}
}

export function getStatus(status: string) {
	switch (status) {
		case 'Pending':
			return StatusTypes.PENDING
		case 'Planned interview':
			return StatusTypes.PLANNED_INTERVIEW
		case 'Invited to interview':
			return StatusTypes.INVITED_TO_INTERVIEW
		case 'Interview declined':
			return StatusTypes.INTERVIEW_DECLINED
		case 'Interview completed':
			return StatusTypes.INTERVIEW_COMPLETED
		case 'Uncertain':
			return StatusTypes.UNCERTAIN
		case 'Planned acceptance':
			return StatusTypes.PLANNED_ACCEPTANCE
		case 'Planned rejection':
			return StatusTypes.PLANNED_REJECTION
		case 'Offer given':
			return StatusTypes.OFFER_GIVEN
		case 'Offer declined':
			return StatusTypes.OFFER_DECLINED
		case 'Accepted':
			return StatusTypes.ACCEPTED
		case 'Rejected':
			return StatusTypes.REJECTED
		default:
			return 'Ukjent status'
	}
}

export function getStatusColor(status: StatusTypes, theme: MantineTheme) {
	switch (status) {
		case StatusTypes.PENDING:
			return theme.colors.ntnui_blue[9]
		case StatusTypes.PLANNED_INTERVIEW:
			return theme.colors.ntnui_yellow[9]
		case StatusTypes.INVITED_TO_INTERVIEW:
			return theme.colors.ntnui_yellow[9]
		case StatusTypes.INTERVIEW_DECLINED:
			return theme.colors.ntnui_red[9]
		case StatusTypes.INTERVIEW_COMPLETED:
			return theme.colors.ntnui_yellow[9]
		case StatusTypes.UNCERTAIN:
			return theme.colors.ntnui_yellow[9]
		case StatusTypes.PLANNED_ACCEPTANCE:
			return theme.colors.ntnui_yellow[9]
		case StatusTypes.PLANNED_REJECTION:
			return theme.colors.ntnui_red[9]
		case StatusTypes.OFFER_GIVEN:
			return theme.colors.ntnui_yellow[9]
		case StatusTypes.OFFER_DECLINED:
			return theme.colors.ntnui_red[9]
		case StatusTypes.ACCEPTED:
			return theme.colors.ntnui_green[9]
		case StatusTypes.REJECTED:
			return theme.colors.ntnui_red[9]
		default:
			return '#000000'
	}
}

export function getIconForStatus(status: string) {
	switch (status) {
		case StatusTypes.PENDING:
			return <File size={20} />
		case StatusTypes.PLANNED_INTERVIEW:
			return <ClipboardText size={20} />
		case StatusTypes.INVITED_TO_INTERVIEW:
			return <PhoneIncoming size={20} />
		case StatusTypes.INTERVIEW_DECLINED:
			return <PhoneOff size={20} />
		case StatusTypes.INTERVIEW_COMPLETED:
			return <PhoneCheck size={20} />
		case StatusTypes.UNCERTAIN:
			return <Clock size={20} />
		case StatusTypes.PLANNED_ACCEPTANCE:
			return <PhonePause size={20} />
		case StatusTypes.PLANNED_REJECTION:
			return <PhonePause size={20} />
		case StatusTypes.OFFER_GIVEN:
			return <UserPlus size={20} />
		case StatusTypes.OFFER_DECLINED:
			return <UserOff size={20} />
		case StatusTypes.ACCEPTED:
			return <Check size={20} />
		case StatusTypes.REJECTED:
			return <X size={20} />
		default:
			return <QuestionMark size={20} />
	}
}
