import { query } from 'express-validator'
import { stringifyEnum } from 'models/Status'
import { SortTypes, StatusTypes } from './enums'

const applicationQueryValidator = () => [
	query('page')
		.optional()
		.isInt({ min: 1 })
		.withMessage('Page must be a number'),
	query('name').optional().isString().withMessage('Must be a string'),
	query('committees').optional().isInt().withMessage('Must be an integer'),
	query('status')
		.optional()
		.isIn(Object.values(StatusTypes))
		.withMessage(
			`The following values are accepted for status: ${stringifyEnum(StatusTypes)}`
		),
	query('sort')
		.optional()
		.isIn(Object.values(SortTypes))
		.withMessage('Invalid value for sort'),
]

const getSortTypeValue = (sortType: SortTypes) => {
	switch (sortType) {
		case SortTypes.NAME_ASC:
			return { name: 1 }
		case SortTypes.NAME_DESC:
			return { name: -1 }
		case SortTypes.DATE_ASC:
			return { submitted_date: 1 }
		case SortTypes.DATE_DESC:
			return { submitted_date: -1 }
		default:
			return {}
	}
}

export default applicationQueryValidator
export { getSortTypeValue }
