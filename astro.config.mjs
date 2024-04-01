import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const site = 'https://astro-cn.com/';

// https://astro.build/config
export default defineConfig({
  site,
	integrations: [
		starlight({
			title: 'Astro 中文网站 ShowCase',
			social: {
				github: 'https://github.com/liruifengv/astro-site-showcase-cn',
			},
      favicon: '/images/favicon.svg',
      head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: site + 'og.png?v=1' },
				},
				{
					tag: 'meta',
					attrs: { property: 'twitter:image', content: site + 'og.png?v=1' },
				},
        {
          tag: 'script',
          attrs: {
            src: 'https://www.googletagmanager.com/gtag/js?id=G-E8HJ681XLY',
            async: true
          },
        },
        {
          tag: 'script',
          content: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E8HJ681XLY');
          `
        }
      ],
      pagination: false,
      pagefind: false,
      customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'ShowCase',
					link: '/showcase/'
				},
			],
		}),
	],
});
