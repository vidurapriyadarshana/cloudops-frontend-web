import type { NextConfig } from "next";

const gatewayUrl = process.env.GATEWAY_URL || "http://34.117.182.186";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${gatewayUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
