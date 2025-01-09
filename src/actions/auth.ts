import { supabase } from '@/lib/supabase';
import { ActionError, defineAction } from 'astro:actions';

import { z } from 'astro:schema';

export const auth = {
  register: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      password: z.string().min(8, {
        message: "密码至少8位",
      })
    }),
    handler: async ({ email, password }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('注册失败', error);
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      return;
    },
  }),
  signin: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      password: z.string()
    }),
    handler: async ({ email, password }, { cookies }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('登录失败', error);
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      const { access_token, refresh_token } = data.session;
      cookies.set("sb-access-token", access_token, {
        sameSite: "strict",
        path: "/",
        secure: true,
      });
      cookies.set("sb-refresh-token", refresh_token, {
        sameSite: "strict",
        path: "/",
        secure: true,
      });

      return;
    },
  }),
  signout: defineAction({
    accept: "form",
    handler: async (notUse, { cookies }) => {
      await supabase.auth.signOut();
      cookies.delete("sb-access-token", { path: "/" });
      cookies.delete("sb-refresh-token", { path: "/" });
      return;
    },
  }),
  get_user: defineAction({
    handler: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('获取用户信息失败', error);
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }
      return data;
    },
  }),
}