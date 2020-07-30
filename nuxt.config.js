module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: "Serverless CNode：Node.js专业中文社区",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "基于 Nuxt (服务器端渲染 SSR) 构建 CNode 社区",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  css: [
    "~/assets/prettify/prettify.css",
    { src: "~/assets/theme/index.scss", lang: "scss" },
  ],
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#3B8070" },
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
  buildModules: ["@nuxtjs/style-resources"],
  styleResources: {
    scss: [
      "sass-bem/_bem.scss",
      "~/assets/theme/common/var.scss",
      "~/assets/theme/common/utils.scss",
      "~/assets/theme/common/mixins.scss",
    ],
  },
  plugins: [
    "~/plugins/axios",
    "~/plugins/filters.js",
    "~/plugins/packages.js",
    { src: "~/assets/prettify/prettify.js", ssr: false },
    { src: "~/plugins/localStorage.js", ssr: false },
  ],
};
