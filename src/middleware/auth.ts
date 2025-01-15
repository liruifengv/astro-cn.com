import { actions } from "astro:actions"
import { defineMiddleware } from "astro:middleware"

const protectedRoutes = ["/dashboard"]
const redirectRoutes = ["/signin", "/register"]

export default defineMiddleware(
	async ({ locals, url, redirect, rewrite, callAction }, next) => {
		const pathname = url.pathname.replace(/\/$/, "") || "/"
		if (protectedRoutes.includes(pathname)) {
			const { data: user, error: getUserError } = await callAction(
				actions.auth.getUser,
				{},
			)
			if (getUserError) {
				console.error(
					`获取用户信息失败 【${getUserError.code}】${getUserError.message}`,
				)
				locals.user = null
				if (getUserError.code === "FORBIDDEN") {
					return redirect("/banned")
				}

				if (getUserError.code === "UNAUTHORIZED") {
					return redirect("/signin")
				}

				return rewrite("/500")
			}

			locals.user = user

			if (!user.is_admin) {
				return redirect("/")
			}
		}

		if (redirectRoutes.includes(pathname)) {
			console.log("redirectRoutes")
			console.log("locals.user", locals.user)
		}

		return next()
	},
)
