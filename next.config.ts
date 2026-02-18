import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "loiplsqbfkpfgzoionaw.supabase.co",
        pathname: "/storage/v1/object/public/program-covers/**",
      },
    ],
  },
};

export default nextConfig;
