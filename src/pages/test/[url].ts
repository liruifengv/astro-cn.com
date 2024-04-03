import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({params}) => {

  const target = params.url
  if (!target) {
    return new Response('URL is required', { status: 400 });
  }

  return new Response(`Your url is ${target}`, { status: 200 });

};