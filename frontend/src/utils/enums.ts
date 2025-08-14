enum AdmissionPeriodStatus {
	finished = 'finished',
	open = 'open',
	upcoming = 'upcoming',
}

enum StatusTypes {
	PENDING = 'Pending',
	PLANNED_INTERVIEW = 'Planned interview',
	INVITED_TO_INTERVIEW = 'Invited to interview',
	INTERVIEW_DECLINED = 'Interview declined',
	INTERVIEW_COMPLETED = 'Interview completed',
	UNCERTAIN = 'Uncertain',
	PLANNED_ACCEPTANCE = 'Planned acceptance',
	PLANNED_REJECTION = 'Planned rejection',
	OFFER_GIVEN = 'Offer given',
	OFFER_DECLINED = 'Offer declined',
	ACCEPTED = 'Accepted',
	REJECTED = 'Rejected',
}

export { AdmissionPeriodStatus, StatusTypes }
