/** @type {import('next').NextConfig} */
const nextPWA = require("next-pwa");

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const config = {
  images: {
    unoptimized: true,
  },
};

module.exports = withPWA(config);
