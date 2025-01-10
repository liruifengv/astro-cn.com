import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
	import.meta.env.SUPABASE_URL,
	import.meta.env.SUPABASE_ANON_KEY,
	{
		auth: {
			flowType: "pkce",
		},
	},
);

export const supabaseAdmin = createClient(
	import.meta.env.SUPABASE_URL,
	import.meta.env.SUPABASE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	},
);
