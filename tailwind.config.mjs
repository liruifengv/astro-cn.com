// Generated color palettes
const accent = { 200: '#a3d2d9', 600: '#007a86', 900: '#003a40', 950: '#002a2f' };
const gray = { 100: '#f6f6f6', 200: '#ededee', 300: '#c2c2c2', 400: '#8b8b8c', 500: '#585859', 700: '#383839', 800: '#262728', 900: '#181818' };

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: { accent, gray },
		},
	},
	plugins: [],
};
