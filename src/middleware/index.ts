import { sequence } from "astro:middleware"

import auth from "./auth"
import supabase from "./supabase"

export const onRequest = sequence(supabase, auth)
