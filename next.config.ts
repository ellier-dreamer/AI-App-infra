import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB, too small for the dashboard's file upload action
      // (see MAX_UPLOAD_BYTES in src/lib/validations/upload.ts). Leaves
      // headroom over that 5MB limit for multipart encoding overhead.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
