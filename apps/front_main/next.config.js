/** @type {import('next').NextConfig} */
const nextConfig = {
  // transpilePackages: ["ui"], // ! For share
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  }
};

module.exports = nextConfig;
