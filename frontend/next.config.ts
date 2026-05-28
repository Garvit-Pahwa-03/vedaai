import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/assignments',
        permanent: false,
      },
    ];
  },
}

export default nextConfig