import { MantineTheme } from '@mantine/core'
import StatusTypes from './enums'
import {
	Check,
	File,
	PhoneCheck,
	PhoneIncoming,
	PhoneOff,
	QuestionMark,
	UserOff,
	UserPlus,
	X,
} from 'tabler-icons-react'

export function getStatusTranslation(status: StatusTypes) {
	switch (status) {
		case StatusTypes.PENDING:
			return 'Ubehandlet'
		case StatusTypes.INVITED_TO_INTERVIEW:
			return 'Invitert til intervju'
		case StatusTypes.INTERVIEW_DECLINED:
			return 'Intervju avslått'
		case StatusTypes.INTERVIEW_COMPLETED:
			return 'Intervju fullført'
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

export function getStatusColor(status: StatusTypes, theme: MantineTheme) {
	switch (status) {
		case StatusTypes.PENDING:
			return theme.colors.ntnui_blue[9]
		case StatusTypes.INVITED_TO_INTERVIEW:
			return theme.colors.ntnui_yellow[9]
		case StatusTypes.INTERVIEW_DECLINED:
			return theme.colors.ntnui_red[9]
		case StatusTypes.INTERVIEW_COMPLETED:
			return theme.colors.ntnui_yellow[9]
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

export function getIconForStatus(status: StatusTypes) {
	switch (status) {
		case StatusTypes.PENDING:
			return <File size={20} />
		case StatusTypes.INVITED_TO_INTERVIEW:
			return <PhoneIncoming size={20} />
		case StatusTypes.INTERVIEW_DECLINED:
			return <PhoneOff size={20} />
		case StatusTypes.INTERVIEW_COMPLETED:
			return <PhoneCheck size={20} />
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
