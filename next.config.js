/** @type {import('next').NextConfig} */
const { default: NextPWA } = require("@ducanh2912/next-pwa");

const withPWA = NextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
  buildExcludes: [/app-build-manifest\.json$/],
});

const config = {
  images: {
    unoptimized: true,
  },
};

module.exports = withPWA(config);
