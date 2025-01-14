import type { Database } from "@/types/database.types"
import { createClient } from "@supabase/supabase-js"

import {
	SUPABASE_ANON_KEY,
	SUPABASE_ROLE_KEY,
	SUPABASE_URL,
} from "astro:env/server"

export const supabase = createClient<Database>(
	SUPABASE_URL,
	SUPABASE_ANON_KEY,
	{
		auth: {
			flowType: "pkce",
		},
	},
)

export const supabaseAdmin = createClient<Database>(
	SUPABASE_URL,
	SUPABASE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	},
)
