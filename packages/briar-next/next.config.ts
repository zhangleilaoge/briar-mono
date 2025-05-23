import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: '/404',
				destination: '/404.html',
				permanent: true
			}
		];
	}
};

export default nextConfig;
