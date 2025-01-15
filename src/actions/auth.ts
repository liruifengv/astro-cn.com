import { ActionError, defineAction } from "astro:actions"
import { z } from "astro:schema"

export const auth = {
	register: defineAction({
		accept: "form",
		input: z.object({
			email: z.string().email(),
			password: z.string().min(8, {
				message: "密码至少8位",
			}),
		}),
		handler: async ({ email, password }, { locals }) => {
			const { error } = await locals.supabase.auth.signUp({
				email,
				password,
			})

			if (error) {
				console.error(`注册失败 ${error.name}: ${error.message}`)
				throw new ActionError({
					code: "BAD_REQUEST",
					message: error.message,
				})
			}

			return
		},
	}),
	signin: defineAction({
		accept: "form",
		input: z.object({
			email: z.string().email(),
			password: z.string(),
		}),
		handler: async ({ email, password }, { locals }) => {
			const { data, error } = await locals.supabase.auth.signInWithPassword({
				email,
				password,
			})

			if (error) {
				console.error(`登录失败 ${error.name}: ${error.message}`)
				throw new ActionError({
					code: "BAD_REQUEST",
					message: error.message,
				})
			}
			return data
		},
	}),
	signout: defineAction({
		accept: "form",
		handler: async (notUse, { locals }) => {
			await locals.supabase.auth.signOut()
			return
		},
	}),
	getUser: defineAction({
		handler: async (notUse, { locals }) => {
			const {
				data: { user },
				error,
			} = await locals.supabase.auth.getUser()
			if (error) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: `${error.name}: ${error.message}`,
				})
			}

			const { data, error: profileError } = await locals.supabase
				.from("sys_users")
				.select("*, op_users(*)")
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				.eq("id", user!.id)
				.single()

			if (profileError) {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: `${profileError.name}: ${profileError.message}`,
				})
			}

			if (data.is_banned) {
				throw new ActionError({
					code: "FORBIDDEN",
					message: "UserHasBeenBanned: 您已被封禁",
				})
			}

			const op = data?.op_users

			if (op && !op.is_banned) {
				return {
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					id: user!.id,
					email: data.email,
					name: data.name,
					avatar: data.avatar,
					is_admin: true,
					is_super_admin: op.is_super_admin,
					is_owner: op.is_owner,
					created_at: data.created_at,
					updated_at: data.updated_at,
					updated_by: data.updated_by,
					is_banned: data.is_banned,
					banned_reason: data.banned_reason,
				}
			}

			return {
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				id: user!.id,
				email: data.email,
				name: data.name,
				avatar: data.avatar,
				is_admin: false,
				is_super_admin: false,
				is_owner: false,
				created_at: data.created_at,
				updated_at: data.updated_at,
				updated_by: data.updated_by,
				is_banned: data.is_banned,
				banned_reason: data.banned_reason,
			}
		},
	}),
	signInWithGithub: defineAction({
		accept: "form",
		handler: async (notUse, { url, locals }) => {
			const { data, error } = await locals.supabase.auth.signInWithOAuth({
				provider: "github",
				options: {
					redirectTo: `${url.origin}/api/auth/callback`,
				},
			})

			if (error) {
				return new ActionError({
					code: "BAD_REQUEST",
					message: error.message,
				})
			}
			return data.url
		},
	}),
	signInWithGoogle: defineAction({
		accept: "form",
		handler: async (notUse, { url, locals }) => {
			const { data, error } = await locals.supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${url.origin}/api/auth/callback`,
				},
			})
			if (error) {
				return new ActionError({
					code: "BAD_REQUEST",
					message: error.message,
				})
			}
			return data.url
		},
	}),
}
