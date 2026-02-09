/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@repo/ui",
    "@repo/animation",
    "@repo/content",
    "@repo/tokens",
    "@repo/types",
    "@repo/utils",
    "@repo/validation",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
