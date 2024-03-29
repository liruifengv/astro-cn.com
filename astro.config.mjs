import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Astro 中文网站 ShowCase',
			social: {
				github: 'https://github.com/liruifengv/astro-site-showcase-cn',
			},
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
