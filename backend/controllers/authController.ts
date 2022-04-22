import { NextFunction, Request, Response } from 'express'
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken'
import {
	getRoleInGroup,
	getNtnuiToken,
	isValidNtnuiToken,
	refreshNtnuiToken,
	getNtnuiProfile,
} from 'ntnui-tools'
import { CustomError, UnauthorizedUserError } from 'ntnui-tools/customError'
import { CommitteeModel } from '../models/Committee'
import { MembershipType } from '../utils/enums'
import { IRoleInCommittee, UserModel } from '../models/User'

async function updateOrCreateUserModel(
	ntnui_no: number,
	first_name: string,
	last_name: string,
	rolesInCommittees: IRoleInCommittee[]
) {
	return UserModel.updateOne(
		{ _id: ntnui_no },
		{
			_id: ntnui_no,
			first_name,
			last_name,
			committees: rolesInCommittees,
		},
		{
			upsert: true,
			runValidators: true,
		}
	)
		.then((user) => user)
		.catch((err) => {
			throw new CustomError(
				`Could not update or create user model.`,
				500,
				`${err.message}`
			)
		})
}

async function getCommittees() {
	return CommitteeModel.find()
		.then((committees) => committees)
		.catch(() => {
			throw new CustomError(
				'Could not retrieve committees from local database',
				500
			)
		})
}

function isRoleInAccessRoles(role: string, access_roles: string[]) {
	return role && (role === MembershipType.leader || access_roles.includes(role))
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
	try {
		if (!req.body.refresh) {
			return res.status(403).json({ message: 'No refresh-token sent!' })
		}
		const token = req.body.refresh
		const tokens = await refreshNtnuiToken(token)
		if (tokens) {
			return res.status(200).json({ access: tokens.access })
		}
		return res
			.status(401)
			.json({ message: 'Refresh token is invalid or expired' })
	} catch (error) {
		return next(error)
	}
}

export async function verify(req: Request, res: Response) {
	if (!req.cookies.accessToken) {
		return res.status(401).json({ message: 'No token sent!' })
	}
	const { accessToken } = req.cookies
	const isValidToken = await isValidNtnuiToken(accessToken)
	if (isValidToken) {
		return res.status(200).json({ message: 'Token is valid' })
	}
	return res.status(401).json({ message: 'Token is invalid or expired' })
}

/**
 * # The login process
 * 1. Send request to NTNUI and retrieve tokens
 * 2. Decode token and get ntnui_no
 * 3. Check users role in each committee in NTNUI membership system
 *     - Get all committees from local db
 * 	   - For each committee, check role in group in NTNUI membership system by slug
 * 	   - Determine if role is in access roles of local committees OR is leader
 * 	     * If true, push to array of role in committee
 * 	   - Retrieve NTNUI profile
 *     - Update user model in local database with roles in committees and name
 *     - Set cookies and allow login
 * 4. If role in committees is empty, unauthorized user
 * @param req express Request object
 * @param res express Response object
 * @param next express NextFunction method
 * @returns tokens
 */
export async function login(req: Request, res: Response, next: NextFunction) {
	try {
		// Use package to get tokens
		const tokens = await getNtnuiToken(req.body.phone_number, req.body.password)
		// Get ntnui_no
		const decodedToken: JwtPayload | null | string = jsonwebtoken.decode(
			tokens.access
		)
		if (decodedToken && typeof decodedToken !== 'string') {
			// Get all committees from local db
			const committees = await getCommittees()
			// Get what role user has in every committee
			const rolesResults = committees.map((committee) =>
				getRoleInGroup(committee.slug, tokens.access)
			)
			const roles = await Promise.all(rolesResults)
			// Get roles in committees
			const rolesInCommittees: IRoleInCommittee[] = []
			for (let roleIdx = 0; roleIdx < roles.length; roleIdx += 1) {
				const committee = committees[roleIdx]
				const role = roles[roleIdx]
				if (role && isRoleInAccessRoles(role, committee.access_roles)) {
					rolesInCommittees.push({
						committee: committee._id,
						role,
					})
				}
			}
			const ntnuiNo = decodedToken.ntnui_no
			if (rolesInCommittees.length) {
				// Retrieve profile from NTNUI
				const profile = await getNtnuiProfile(tokens.access)
					.then((profileRes) => profileRes.data)
					.catch(() => {
						throw new CustomError('Unable to log in', 500)
					})
				if (!profile) {
					throw new CustomError('Could not get profile from NTNUI', 500)
				}
				await updateOrCreateUserModel(
					ntnuiNo,
					profile.first_name,
					profile.last_name,
					rolesInCommittees
				)
				return res
					.cookie('accessToken', tokens.access, {
						maxAge: 1800000, // 30 minutes
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						sameSite: true,
					})
					.cookie('refreshToken', tokens.refresh, {
						maxAge: 86400000, // 1 day
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						sameSite: true,
					})
					.status(200)
					.json({ message: 'Successful login' })
			}
		}
		throw UnauthorizedUserError
	} catch (error) {
		return next(error)
	}
}

export function logout(_req: Request, res: Response) {
	return res
		.clearCookie('accessToken')
		.clearCookie('refreshToken')
		.status(200)
		.json({ message: 'Successfully logged out' })
}
