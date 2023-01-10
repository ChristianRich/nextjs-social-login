/** @type {import('next').NextConfig} */

// https://blog.logrocket.com/how-to-use-proxy-next-js/
// https://nextjs.org/docs/api-reference/next.config.js/rewrites
const rewrites = () => {
  const USER_API_URL = process.env.USER_API_URL;

  if (!USER_API_URL) {
    throw new Error("next.config.js: USER_API_URL is required");
  }

  return [
    {
      source: "/api/user-api/username/:username*/verify",
      destination: `${USER_API_URL}/username/:username*/verify`,
    },
    {
      source: "/api/user-api/user",
      destination: `${USER_API_URL}/user`,
    },
  ];
};

const nextConfig = {
  reactStrictMode: true,
  rewrites,
};

module.exports = nextConfig;
