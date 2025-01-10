import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";

export default defineMiddleware(
  async ({ locals }, next) => {
    // 如果已经有 supabase 实例，直接跳过
    if (locals.supabase) {
      console.log("supabase instance already exists");
      return next();
    }

    const { env } = locals.runtime;
    const supabase = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY,
      {
        auth: {
          flowType: "pkce",
        },
      },
    );
    const supabaseAdmin = createClient(
      import.meta.env.SUPABASE_URL,
      import.meta.env.SUPABASE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
    locals.supabase = supabase;
    locals.supabaseAdmin = supabaseAdmin;

    return next();
  },
);
