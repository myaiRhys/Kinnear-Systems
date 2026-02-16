import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/Kinnear-Systems" : "",
  assetPrefix: isProd ? "/Kinnear-Systems/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
