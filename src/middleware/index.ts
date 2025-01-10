import { sequence } from "astro:middleware";

import supabase from "./supabase";
import auth from "./auth";

export const onRequest = sequence(supabase, auth);