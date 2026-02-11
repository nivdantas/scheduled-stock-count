import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [{
			source: '/',
			destination: '/login',
			permanent: true,
		}]
	},
  output: "standalone",
	reactStrictMode: false,
	outputFileTracingRoot: path.join(__dirname, '../../'),
	typescript: {
		ignoreBuildErrors: true,
	},

};

export default nextConfig;
