import type { APIRoute } from "astro";

const robots = `
User-agent: *
Disallow:

User-agent: *
Allow: /

Sitemap: ${
	new URL("sitemap-index.xml", "https://astro-cn.com").href
}
`.trim();

export const GET: APIRoute = () =>
	new Response(robots, {
		headers: { "Content-Type": "text/plain" },
	});
