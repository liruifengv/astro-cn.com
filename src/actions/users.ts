import { ActionError, defineAction } from "astro:actions"
import { z } from "astro:schema"

export const users = {
	getUserList: defineAction({
		input: z.object({
			page: z.number().int().optional().default(1),
			pageSize: z.number().int().optional().default(10),
		}),
		handler: async ({ page, pageSize }, { locals }) => {
			const start = (page - 1) * pageSize
			const end = start + pageSize - 1

			const [users, count] = await Promise.all([
				// Get paginated users
				locals.supabase
					.from("sys_users")
					.select("*, op_users(*)")
					.range(start, end)
					.order("created_at", { ascending: false }),

				// Get total count
				locals.supabase
					.from("sys_users")
					.select("*", { count: "exact", head: true }),
			])

			if (users.error || count.error) {
				const error = users.error || count.error

				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: `${error?.name}: ${error?.message}`,
				})
			}

			return {
				users: users.data,
				total: count.count,
			}
		},
	}),
}
