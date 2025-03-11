import 'dotenv/config';

import { OpenAI } from 'openai';
import puppeteer from 'puppeteer';

// 初始化 OpenAI 客户端
const openai = new OpenAI({
	apiKey: process.env.BRIAR_API_KEY,
	baseURL: 'https://api.chatanywhere.tech/v1'
});

// 原油价格地址
const OIL_PRICE_URL = 'https://www.zuixinyoujia.com/';
// const OIL_PRICE_URL = 'https://quote.eastmoney.com/globalfuture/CL00Y.html';

// 自定义提取规则（根据页面结构调整selector）
const OIL_PRICE_SCHEMA = {
	WTI美国原油价格: {
		price: 'number',
		change: 'string'
	},
	布伦特原油价格: {
		price: 'number',
		change: 'string'
	}
};

async function fetchOilPrice() {
	let browser;
	try {
		// 启动 Puppeteer 浏览器
		browser = await puppeteer.launch({ headless: true }); // headless: true 表示无头模式
		const page = await browser.newPage();

		// 设置请求头，模拟浏览器行为
		await page.setUserAgent(
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
		);

		// 导航到目标页面
		console.log('正在加载页面...');
		await page.goto(OIL_PRICE_URL, { waitUntil: 'networkidle2', timeout: 60000 }); // 等待页面加载完成

		// 获取页面中的完整 HTML 内容
		console.log('页面加载完成，正在提取内容...');
		const pageContent = await page.content();

		// 使用 OpenAI 进行语义提取
		const prompt = `从以下文本中提取原油价格信息，并按照以下格式返回：\n${JSON.stringify(
			OIL_PRICE_SCHEMA,
			null,
			2
		)}\n\n文本内容：\n${pageContent}`;

		const gptResponse = await openai.chat.completions.create({
			model: 'gpt-4', // 使用合适的模型
			messages: [
				{
					role: 'user',
					content: prompt // 将 prompt 作为用户消息
				}
			],
			max_tokens: 150
		});

		// 解析 GPT 返回的内容
		const extractedData = gptResponse.choices[0].message.content.trim();

		console.log('提取的原油价格信息:', extractedData);
	} catch (error) {
		console.error('抓取或提取失败:', error.message);
		return null;
	} finally {
		// 关闭浏览器
		if (browser) {
			await browser.close();
		}
	}
}

const main = async () => {
	await fetchOilPrice();
};

main();
