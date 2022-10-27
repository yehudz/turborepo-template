/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['ui'])

const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  }
})

module.exports = nextConfig
