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

      return {
        status: 200,
        data: "注册成功",
      }
    },
  })
}