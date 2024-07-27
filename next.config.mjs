/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      // {
      //   protocol: "https",
      //   hostname: "youtube.com",
      // },
    ],
  },
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
