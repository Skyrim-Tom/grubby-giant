// @ts-check
import { defineConfig } from 'astro/config';

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: "https://www.momoc.cn",
  integrations: [vue()],
  output: 'static',
  build: {
    format: 'directory'
  },
  markdown: {
    shikiConfig: {
      // 双主题配置 - 支持浅色/深色切换
      // https://shiki.style/guide/dual-themes
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // 禁用默认配色，让 CSS 控制主题显示
      // https://shiki.style/guide/dual-themes#without-default-color
      defaultColor: false,
      // 启用自动换行以防止水平滚动
      wrap: true,
    },
  },
});