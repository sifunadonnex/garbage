/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        WEB3_AUTH_CLIENT_ID: process.env.WEB3_AUTH_CLIENT_ID,
        DATABASE_URL: process.env.DATABASE_URL,
    }
};

export default nextConfig;
