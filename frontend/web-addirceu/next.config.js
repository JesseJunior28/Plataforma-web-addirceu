/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        'form-data': false,
        stream: false,
        zlib: false,
        'http': false,
        'https': false,
        'url': false,
        path: false,
        os: false,
        crypto: false,
        util: false,
        buffer: false
      };
      
      // Adicionar alias para ignorar modules específicos do Node.js
      config.resolve.alias = {
        ...config.resolve.alias,
        'form-data': false,
      };

      // Ignorar módulos específicos do axios que causam problemas no browser
      config.externals = config.externals || {};
      config.externals['form-data'] = 'form-data';
    }
    return config;
  },
}

module.exports = nextConfig
