import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
const site = 'https://astro-cn.com/';


// https://astro.build/config
export default defineConfig({
  site,
  output: "server",
  integrations: [starlight({
    title: 'Astro 中文网站 Showcase',
    social: {
      github: 'https://github.com/liruifengv/astro-site-showcase-cn'
    },
    head: [{
      tag: 'meta',
      attrs: {
        property: 'og:image',
        content: site + 'og.png?v=1'
      }
    }, {
      tag: 'meta',
      attrs: {
        property: 'twitter:image',
        content: site + 'og.png?v=1'
      }
    }, {
      tag: 'script',
      attrs: {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-E8HJ681XLY',
        async: true
      }
    }, {
      tag: 'script',
      content: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E8HJ681XLY');
          `
    }],
    pagination: false,
    pagefind: false,
    customCss: ['./src/styles/tailwind.css'],
    sidebar: [{
      label: 'Showcase',
      link: '/showcase/'
    }]
  }), tailwind({
    // 禁用默认的基础样式
    applyBaseStyles: false
  })],
  adapter: node({
    mode: "standalone"
  })
});