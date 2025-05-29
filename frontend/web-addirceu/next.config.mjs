/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'axios': 'axios/dist/browser/axios.cjs'  // Força o uso da versão do navegador
    }
    return config
  },
}
