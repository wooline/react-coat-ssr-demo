module.exports = {
  clientPublicPath: "/client/",
  apiServer: {
    "^/ajax/": `${process.env.DEV_URL}/ajax/`,
    "^/captcha/": `${process.env.DEV_URL}/captcha/`,
  },
};
