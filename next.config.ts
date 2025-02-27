import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const config: NextConfig = {
  reactStrictMode: true,
};

const nextConfig = withPWA({
  dest: "public",
  register: true,
  // @ts-ignore: skipWaiting is a valid option for PWA configuration
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(config);

export default nextConfig;
