import { ActionError, defineAction } from "astro:actions"
import { z } from "astro:schema"
import { supabase } from "@/lib/supabase"

export const auth = {
	register: defineAction({
		accept: "form",
		input: z.object({
			email: z.string().email(),
			password: z.string().min(8, {
				message: "密码至少8位",
			}),
		}),
		handler: async ({ email, password }) => {
			const { error } = await supabase.auth.signUp({
				email,
				password,
			})

			if (error) {
				console.error("注册失败", error)
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
		handler: async ({ email, password }, { cookies }) => {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			})

			if (error) {
				console.error("登录失败", error)
				throw new ActionError({
					code: "BAD_REQUEST",
					message: error.message,
				})
			}

			const { access_token, refresh_token } = data.session
			cookies.set("sb-access-token", access_token, {
				sameSite: "strict",
				path: "/",
				secure: true,
			})
			cookies.set("sb-refresh-token", refresh_token, {
				sameSite: "strict",
				path: "/",
				secure: true,
			})

			return
		},
	}),
	signout: defineAction({
		accept: "form",
		handler: async (notUse, { cookies }) => {
			await supabase.auth.signOut()
			cookies.delete("sb-access-token", { path: "/" })
			cookies.delete("sb-refresh-token", { path: "/" })
			return
		},
	}),
	get_user: defineAction({
		handler: async () => {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser()
			if (error) {
				console.error("获取用户信息失败", error)
				throw new ActionError({
					code: "BAD_REQUEST",
					message: error.message,
				})
			}

			const { data, error: profileError } = await supabase
				.from("sys_users")
				.select("*, op_users(*)")
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				.eq("id", user!.id)
				.single()

			if (profileError) {
				console.error("获取用户信息失败", profileError)
				throw new ActionError({
					code: "BAD_REQUEST",
					message: profileError.message,
				})
			}

			if (data.is_banned) {
				console.error("当前用户已被封禁。")
				throw new ActionError({
					code: "FORBIDDEN",
					message: "您已被封禁",
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
		handler: async (notUse, { url }) => {
			const { data, error } = await supabase.auth.signInWithOAuth({
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
		handler: async (notUse, { url }) => {
			const { data, error } = await supabase.auth.signInWithOAuth({
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
