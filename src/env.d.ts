/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

interface ImportMetaEnv {
	readonly SUPABASE_URL: string
	readonly SUPABASE_ANON_KEY: string
	readonly SUPABASE_ROLE_KEY: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

declare global {
	declare namespace App {
		interface Locals extends Runtime {
			user:
				| (Database["public"]["Tables"]["sys_users"]["Row"] &
						Database["public"]["Tables"]["op_users"]["Row"])
				| null
			supabase: SupabaseClient<Database>
		}
	}
}
