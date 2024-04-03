import puppeteer from 'puppeteer';

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({url}) => {

  let img = null;

  const target = url.searchParams.get('url')
  if (!target) {
    return new Response('URL is required', { status: 400 });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(target);
  await page.setViewport({width: 1600, height: 900});
  img = await page.screenshot();
  await browser.close();

  return new Response(img, { headers: { 'Content-Type': 'image/png' } });
};