import { createClient } from "@supabase/supabase-js";

console.log("import.meta.env.SUPABASE_URL", import.meta.env.SUPABASE_URL);
console.log("import.meta.env.SUPABASE_ANON_KEY", import.meta.env.SUPABASE_ANON_KEY);
console.log("import.meta.env.SUPABASE_ROLE_KEY", import.meta.env.SUPABASE_ROLE_KEY);
console.log("process.env.SUPABASE_ROLE_KEY", process.env.SUPABASE_ROLE_KEY);
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
