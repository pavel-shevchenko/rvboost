const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  // transpilePackages: ["ui"], // ! For share
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../')
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  }
};

module.exports = nextConfig;
