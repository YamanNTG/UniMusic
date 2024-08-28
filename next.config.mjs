/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  webpack(config) {
    // Adding SVGR support for SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Return the modified config
    return config;
  },
};

// Export the configuration directly
export default nextConfig;
