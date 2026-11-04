/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow next/image to optimize our own uploaded files served from /files/...
    localPatterns: [{ pathname: "/files/**" }],
  },
};

export default nextConfig;
