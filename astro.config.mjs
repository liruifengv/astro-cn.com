import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
const site = 'https://astro-cn.com/';

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [tailwind({
    // 禁用默认的基础样式
    applyBaseStyles: false,
  })]
});