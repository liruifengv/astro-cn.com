import siteInfo from "@/data/site-info"
import type { APIRoute } from "astro"

const robots = `
User-agent: *
Disallow:

User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", siteInfo.url).href}
`.trim()

export const GET: APIRoute = () =>
	new Response(robots, {
		headers: { "Content-Type": "text/plain" },
	})
