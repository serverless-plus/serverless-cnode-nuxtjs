require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';
const STATIC_URL = isProd
  ? `https://${process.env.CDN_DOMAIN}`
  : `http://localhost:${parseInt(process.env.PORT, 10) || 8000}`

module.exports = {
  head: {
    title: "Serverless CNode：Node.js专业中文社区",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "基于 Serverless 部署和Nuxt (服务器端渲染 SSR) 构建 CNode 社区",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: `${STATIC_URL}/favicon.ico` }],
  },
  css: [
    "~/assets/prettify/prettify.css",
    { src: "~/assets/theme/index.scss", lang: "scss" },
  ],
  loading: { color: "#3B8070" },
  env: {
    STATIC_URL: STATIC_URL,
  },
  build: {
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
        });
      }
      // ********* Notice ***********
      // ********* If prod and set CDN_DOMAIN, setup publicPath to it
      if (!isDev && process.env.CDN_DOMAIN) {
        config.output.publicPath = `https://${process.env.CDN_DOMAIN}/`
      }
    },
  },
  modules: ["@nuxtjs/axios", "@nuxtjs/toast"],
  toast: {
    position: "top-center",
    duration: 800,
  },
  axios: {
    baseURL: 'https://cnodejs.org/api/v1',
  },
  buildModules: [
    "@nuxtjs/style-resources",
    '@nuxtjs/pwa',
  ],
  styleResources: {
    scss: [
      "sass-bem/_bem.scss",
      "~/assets/theme/common/var.scss",
      "~/assets/theme/common/utils.scss",
      "~/assets/theme/common/mixins.scss",
    ],
  },

  pwa: {
    // TODO: can not work with custom express server with icon?
    icon: false,
    manifest: {
      name: "Serverless CNode",
      lang: "zh-CN"
    }
  },
  plugins: [
    "~/plugins/axios",
    "~/plugins/filters.js",
    "~/plugins/packages.js",
    { src: "~/assets/prettify/prettify.js", ssr: false },
    { src: "~/plugins/localStorage.js", ssr: false },
  ],
};
