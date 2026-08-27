/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    remotePatterns: [
          {
            protocol: 'http',
            hostname: 'd2l6vvcxr1n0o0.cloudfront.net',
            port: '',
            pathname: '/**',
          },
        ],
  },
  output: 'standalone',
  /*reactStrictMode: false,*/
  // Preservar la funcionalidad de Redux
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    // 1. Regla específica para SVGs (usando SVGR)
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // 2. Regla específica para WebM y otros videos (como Assets estáticos)
    config.module.rules.push({
      test: /\.(webm|mp4|ogv)$/i,
      type: "asset/resource",
      generator: {
        // TODO: 'static/media/' para archivos multimedia
        filename: "static/media/[name].[hash][ext]",
      },
    });

    return config;
  },
};

module.exports = nextConfig;
