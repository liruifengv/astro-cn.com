import { defineConfig, envField } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import cloudflare from '@astrojs/cloudflare';
import icon from "astro-icon";
import react from "@astrojs/react";
import expressiveCode from "astro-expressive-code";

import siteInfo from './src/data/site-info';

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: siteInfo.url,
  output: 'server',
  integrations: [
    tailwind({
      // 禁用默认的基础样式
      applyBaseStyles: false,
    }),
    icon(),
    react(),
    sitemap(),
    expressiveCode({
      themes: ["material-theme-darker"],
      plugins: [{
        name: "custom-style",
        baseStyles: () => `
              .frame.is-terminal:not(.has-title) .header {display: none;}
              .frame .header {border-bottom: 2px solid #313131;}
              .frame.is-terminal .header::before {display: none;}
              .frame.is-terminal:not(.has-title) {
                --button-spacing: 0.4rem;
              }
              .frame.is-terminal:not(.has-title) code, .frame.is-terminal:not(.has-title) pre {
                border-radius: 4px
              }
              .frame.is-terminal .header {
                justify-content: initial;
                font-weight: initial;
                padding-left: 1rem;
                color: #fff;
              }
              `,
        hooks: {}
      }],
      useThemedScrollbars: false,
      useThemedSelectionColors: false,
      styleOverrides: {
        uiLineHeight: "inherit",
        codeFontSize: "0.875rem",
        codeLineHeight: "1.25rem",
        borderRadius: "4px",
        borderWidth: "0px",
        codePaddingInline: "1rem",
        codeFontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;'
      }
    }),
    mdx()
  ],
  adapter: cloudflare({
    imageService: 'passthrough',
    platformProxy: {
      enabled: true,
      configPath: '.wrangler/wrangler.toml',
    },
  }),
  markdown: {
    shikiConfig: {
      theme: "material-theme-darker",
      wrap: false
    },
  },
  env: {
    schema: {
      SUPABASE_URL: envField.string({
        context: "server",
        access: "public",
      }),
      SUPABASE_ANON_KEY: envField.string({
        context: "server",
        access: "public",
      }),
      SUPABASE_ROLE_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD && {
        "react-dom/server": "react-dom/server.edge",
      },
    },
  }
});