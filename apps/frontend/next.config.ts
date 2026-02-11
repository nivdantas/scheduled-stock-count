import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
	output: "standalone",

	reactStrictMode: false,

	outputFileTracingRoot: path.join(__dirname, '../../'),

	typescript: {
		ignoreBuildErrors: true,
	},

	async redirects() {
		return [{
			source: '/',
			destination: '/login',
			permanent: true,
		}]
	}
};

export default nextConfig;
