/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;
import { type User } from "@supabase/supabase-js";

interface ImportMetaEnv {
	readonly SUPABASE_URL: string;
	readonly SUPABASE_ANON_KEY: string;
	readonly SUPABASE_ROLE_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare global {
	declare namespace App {
		interface Locals extends Runtime {
			user: User | null;
      supabase: import("@supabase/supabase-js").SupabaseClient;
      supabaseAdmin: import("@supabase/supabase-js").SupabaseClient;
		}
	}
}
