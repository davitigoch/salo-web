import type { NextConfig } from 'next';
import { execSync } from 'node:child_process';

function getBuildVersion() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }

  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return new Date().toISOString();
  }
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SALO_WEB_BUILD_VERSION: getBuildVersion(),
  },
};

export default nextConfig;
