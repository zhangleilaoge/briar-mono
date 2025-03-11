import 'dotenv/config';

import FirecrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';

// 初始化Firecrawl客户端
const app = new FirecrawlApp({
	apiKey: process.env.FIRE_CRAWL_API_KEY // 从环境变量读取API Key
});

// 原油价格地址
const OIL_PRICE_URL = 'https://www.zuixinyoujia.com/';

// 自定义提取规则（根据页面结构调整selector）
const OIL_PRICE_SCHEMA = z.object({
	WTI美国原油价格: z.object({
		price: z.number(),
		change: z.string()
	}),
	布伦特原油价格: z.object({
		price: z.number(),
		change: z.string()
	})
});

async function fetchOilPrice() {
	try {
		const response = await app.scrapeUrl(OIL_PRICE_URL, {
			extract: {
				prompt: '获取原油价格、变化和更新时间：变化用`${diff} ${diffPercent}`表示。',
				schema: OIL_PRICE_SCHEMA
			},
			formats: ['extract']
		});

		console.log('response:', response);
	} catch (error) {
		console.error('抓取失败:', error.message);
		return null;
	}
}

const main = async () => {
	await fetchOilPrice();
};

main();
