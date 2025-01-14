import { actions } from "astro:actions"
import { defineMiddleware } from "astro:middleware"
import { supabase } from "@/lib/supabase"
import type { AstroCookies } from "astro"

const protectedRoutes = ["/", "/dashboard"]
const redirectRoutes = ["/signin", "/register"]

export default defineMiddleware(
	async ({ locals, url, cookies, redirect, rewrite, callAction }, next) => {
		const pathname = url.pathname.replace(/\/$/, "") || "/"
		if (protectedRoutes.includes(pathname)) {
			const { accessToken, refreshToken } = getTokens(cookies)

			if (!accessToken || !refreshToken) {
				return redirect("/signin")
			}

			const { data, error } = await supabase.auth.setSession({
				refresh_token: refreshToken.value,
				access_token: accessToken.value,
			})

			if (error) {
				deleteToken(cookies)
				return redirect("/signin")
			}

			const access_token = data.session?.access_token as string
			const refresh_token = data.session?.refresh_token as string

			setTokens(cookies, access_token, refresh_token)
			const { data: user, error: getUserError } = await callAction(
				actions.auth.get_user,
				{},
			)
			if (getUserError) {
				console.error(`获取用户信息失败 【${getUserError.code}】${getUserError.message}`)
				if (getUserError.code === "FORBIDDEN") {
					return redirect("/banned")
				}

        if (getUserError.code === "UNAUTHORIZED") {
          return redirect("/signin")
        }

				return rewrite("/500")
			}

			locals.user = user
		}

		if (redirectRoutes.includes(pathname)) {
			const { accessToken, refreshToken } = getTokens(cookies)

			if (accessToken && refreshToken) {
				return redirect("/")
			}
		}

		return next()
	},
)

const deleteToken = (cookies: AstroCookies) => {
	cookies.delete("sb-access-token", { path: "/" })
	cookies.delete("sb-refresh-token", { path: "/" })
}

const getTokens = (cookies: AstroCookies) => {
	const accessToken = cookies.get("sb-access-token")
	const refreshToken = cookies.get("sb-refresh-token")

	return { accessToken, refreshToken }
}

const setTokens = (
	cookies: AstroCookies,
	accessToken: string,
	refreshToken: string,
) => {
	cookies.set("sb-access-token", accessToken, {
		sameSite: "strict",
		path: "/",
		secure: true,
	})
	cookies.set("sb-refresh-token", refreshToken, {
		sameSite: "strict",
		path: "/",
		secure: true,
	})
}
