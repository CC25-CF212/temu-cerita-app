import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
  // Sembunyikan header X-Powered-By
  poweredByHeader: false,

  // Konfigurasi custom headers untuk menyembunyikan versi
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Server",
            value: "Server", // Gantikan server header
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },

  // Webpack config untuk production
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Hilangkan komentar yang berisi versi
      config.optimization.minimize = true;
    }
    return config;
  },

  // Hilangkan output verbose
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Compress untuk menghilangkan metadata
  compress: true,
  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
};

export default nextConfig;
