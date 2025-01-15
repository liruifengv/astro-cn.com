import { defineMiddleware } from "astro:middleware"
import { createServerClient, parseCookieHeader } from "@supabase/ssr"

import type { Database } from "@/types/database.types"

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "astro:env/server"

export default defineMiddleware(async ({ locals, cookies, request }, next) => {
	const supabase = createServerClient<Database>(
		SUPABASE_URL,
		SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return parseCookieHeader(request.headers.get("Cookie") ?? "")
				},
				setAll(cookiesToSet) {
					for (const { name, value, options } of cookiesToSet) {
						cookies.set(name, value, options)
					}
				},
			},
		},
	)

	locals.supabase = supabase

	return next()
})
