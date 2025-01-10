import { createClient } from "@supabase/supabase-js";

console.log("import.meta.env.SUPABASE_URL", import.meta.env.SUPABASE_URL);
console.log("import.meta.env.SUPABASE_ANON_KEY", import.meta.env.SUPABASE_ANON_KEY);
console.log("process.env.SUPABASE_URL", process.env.SUPABASE_URL);
console.log("process.env.SUPABASE_ANON_KEY", process.env.SUPABASE_ANON_KEY);

export const supabase = createClient(
	process.env.SUPABASE_URL as string,
	process.env.SUPABASE_ANON_KEY as string,
	{
		auth: {
			flowType: "pkce",
		},
	},
);

// export const supabaseAdmin = createClient(
// 	import.meta.env.SUPABASE_URL,
// 	import.meta.env.SUPABASE_ROLE_KEY,
// 	{
// 		auth: {
// 			autoRefreshToken: false,
// 			persistSession: false,
// 		},
// 	},
// );
