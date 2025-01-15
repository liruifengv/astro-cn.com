import { actions } from "astro:actions"
import { defineMiddleware } from "astro:middleware"

const protectedRoutes = ["/dashboard"]
const redirectRoutes = ["/signin", "/register"]

export default defineMiddleware(
	async ({ locals, url, redirect, rewrite, callAction }, next) => {
		const pathname = url.pathname.replace(/\/$/, "") || "/"

		const { data: user, error: getUserError } = await callAction(
			actions.auth.getUser,
			{},
		)
		if (getUserError) {
			locals.user = null

			if (getUserError.code === "FORBIDDEN") {
				console.error(
					`用户被封禁【${getUserError.code}】${getUserError.message}`,
				)
				return redirect("/banned")
			}
			if (protectedRoutes.includes(pathname)) {
				console.error(
					`获取用户信息失败 【${getUserError.code}】${getUserError.message}`,
				)
				if (getUserError.code === "UNAUTHORIZED") {
					return redirect("/signin")
				}
				return rewrite("/500")
			}
			return next()
		}

		locals.user = user

		if (!user.is_admin && protectedRoutes.includes(pathname)) {
			return redirect("/")
		}

		if (redirectRoutes.includes(pathname)) {
			if (locals.user) {
				return redirect("/")
			}
		}

		return next()
	},
)
