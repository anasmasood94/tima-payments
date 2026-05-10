import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoids dev-only "SegmentViewNode" / React Client Manifest bundler errors (Next 15 + fast refresh).
  experimental: {
    devtoolSegmentExplorer: false,
  },
};

export default nextConfig;
