/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

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
		interface Locals {
			user: User | null;
		}
	}
}
