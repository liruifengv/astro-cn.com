import { createClient } from "@supabase/supabase-js";

import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_ROLE_KEY
 } from 'astro:env/server';

export const supabase = createClient(
	SUPABASE_URL,
	SUPABASE_ANON_KEY,
	{
		auth: {
			flowType: "pkce",
		},
	},
);

export const supabaseAdmin = createClient(
	SUPABASE_URL,
	SUPABASE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	},
);
