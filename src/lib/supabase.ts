import { createClient } from "@supabase/supabase-js";

console.log("import.meta.env.SUPABASE_URL", import.meta.env.SUPABASE_URL);
console.log("import.meta.env.SUPABASE_ANON_KEY", import.meta.env.SUPABASE_ANON_KEY);
console.log("process.env.SUPABASE_URL", process.env.SUPABASE_URL);
console.log("process.env.SUPABASE_ANON_KEY", process.env.SUPABASE_ANON_KEY);


import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY
 } from 'astro:env/server';

console.log("SUPABASE_URL", SUPABASE_URL);
console.log("SUPABASE_ANON_KEY", SUPABASE_ANON_KEY);

//  const SUPABASE_URL = getSecret('SUPABASE_URL');
//   const SUPABASE_ANON_KEY = getSecret('SUPABASE_ANON_KEY');

export const supabase = createClient(
	SUPABASE_URL,
	SUPABASE_ANON_KEY,
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
