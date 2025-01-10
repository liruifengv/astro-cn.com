import { supabase } from "@/lib/supabase";
import { defineMiddleware } from "astro:middleware";

const protectedRoutes = ["/", "/dashboard"];
const redirectRoutes = ["/signin", "/register"];

export default defineMiddleware(
	async ({ locals, url, cookies, redirect }, next) => {

    console.log("process.env.SUPABASE_URL in middleware", process.env.SUPABASE_URL);
    console.log("process.env.SUPABASE_ANON_KEY in middleware", process.env.SUPABASE_ANON_KEY);


    const pathname = url.pathname.replace(/\/$/, "") || "/";
		if (protectedRoutes.includes(pathname)) {
			const accessToken = cookies.get("sb-access-token");
			const refreshToken = cookies.get("sb-refresh-token");

			if (!accessToken || !refreshToken) {
				return redirect("/signin");
			}

			const { data, error } = await supabase.auth.setSession({
				refresh_token: refreshToken.value,
				access_token: accessToken.value,
			});

			if (error) {
				cookies.delete("sb-access-token", {
					path: "/",
				});
				cookies.delete("sb-refresh-token", {
					path: "/",
				});
				return redirect("/signin");
			}

			locals.user = data.user;
			cookies.set("sb-access-token", data?.session?.access_token!, {
				sameSite: "strict",
				path: "/",
				secure: true,
			});
			cookies.set("sb-refresh-token", data?.session?.refresh_token!, {
				sameSite: "strict",
				path: "/",
				secure: true,
			});
		}

		if (redirectRoutes.includes(pathname)) {
			const accessToken = cookies.get("sb-access-token");
			const refreshToken = cookies.get("sb-refresh-token");

			if (accessToken && refreshToken) {
				return redirect("/");
			}
		}

		return next();
	},
);
