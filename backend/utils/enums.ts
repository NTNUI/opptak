enum MembershipType {
	leader = 'leader',
	deputy_leader = 'deputy_leader',
	cashier = 'cashier',
	board_member = 'board_member',
	deputy_board_member = 'deputy_board_member',
	volunteer = 'volunteer',
	member = 'member',
}

enum StatusEnum {
	PENDING = 'Pending',
	GIVEN_INTERVIEW = 'Given interview',
	INTERVIEW_DECLINED = 'Interview declined',
	GIVEN_OFFER = 'Given offer',
	OFFER_DECLINED = 'Offer declined',
	ACCEPTED = 'Accepted',
	REJECTED = 'Rejected',
}

export { StatusEnum, MembershipType }
