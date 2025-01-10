import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import cloudflare from '@astrojs/cloudflare';
const site = 'https://astro-cn.com/';

// https://astro.build/config
export default defineConfig({
  site,
  output: 'server',
  integrations: [tailwind({
    // 禁用默认的基础样式
    applyBaseStyles: false,
  })],
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true,
      configPath: '.wrangler/wrangler.toml',
    },
  })
});