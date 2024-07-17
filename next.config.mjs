/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  swcMinify: true,
  // @description https://github.com/vercel/next.js/issues/66526
  // experimental: {
  //   turbo: {
  //     rules: {
  //       "*.svg": {
  //         loaders: ["@svgr/webpack"],
  //         as: "*.js, *.tsx, *.ts",
  //       },
  //     },
  //   },
  // },
};

export default nextConfig;
