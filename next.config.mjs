import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'zustand']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        path: false
      };
    }
    return config;
  }
};

export default withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true
})(nextConfig);
