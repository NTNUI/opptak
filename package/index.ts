import axios from 'axios'
import { BadRequest, CustomError, UnauthorizedUser } from './customError'

interface IGroup {
	_id: Number
	name: string
	slug: string
}

function printSlug(committee: IGroup) {
	console.log(committee.slug) // eslint-disable-line no-console
}

axios.defaults.baseURL = 'https://dev.api.ntnui.no/' // GET FROM ENV OR CONFIG

type IGroupPageResult = {
	data: {
		membership: {
			type: string
		}
	}
}

async function getRoleInGroup(
	group_slug: string,
	token: string
): Promise<string | null> {
	return axios
		.get(`/groups/${group_slug}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((retrievedGroup: IGroupPageResult) => {
			const group = retrievedGroup.data
			if (group.membership) {
				return group.membership.type
			}
			return null
		})
		.catch((err) => {
			// Could not find group in NTNUI membership system
			if (err.response.status === 404) {
				return null
			}
			throw new CustomError('Could not get role in group', 500)
		})
}

type INtnuiToken = {
	access: string
	refresh: string
}

interface ITokenResponse {
	data: {
		refresh: string
		access: string
	}
}

async function getNtnuiToken(
	phone_number: string,
	password: string
): Promise<INtnuiToken> {
	return axios
		.post('token/', {
			phone_number,
			password,
		})
		.then((tokenRes: ITokenResponse) => ({
			access: tokenRes.data.access,
			refresh: tokenRes.data.refresh,
		}))
		.catch((err) => {
			if (err.response.status === 401) {
				throw UnauthorizedUser
			} else if (err.response.status === 400) {
				throw BadRequest
			}
			throw new CustomError('Unexpected error.', 500)
		})
}

async function isValidNtnuiToken(token: string): Promise<boolean> {
	return axios
		.post('token/verify/', {
			token,
		})
		.then(() => true)
		.catch(() => false)
}

export { printSlug, getRoleInGroup, getNtnuiToken, isValidNtnuiToken }
