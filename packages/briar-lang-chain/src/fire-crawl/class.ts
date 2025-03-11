import axios from 'axios';
import cheerio from 'cheerio';

// 原油价格地址
const OIL_PRICE_URL = 'https://www.zuixinyoujia.com/';

async function fetchOilPrice() {
	try {
		// 发起 HTTP 请求获取页面内容
		const response = await axios.get(OIL_PRICE_URL);
		const html = response.data;

		// 使用 cheerio 加载 HTML 内容
		const $ = cheerio.load(html);

		// 提取 WTI 美国原油价格
		const wtiPrice = $('.wti-price').text().trim(); // 假设页面中 WTI 价格的类名为 .wti-price
		const wtiChange = $('.wti-change').text().trim(); // 假设变化的类名为 .wti-change

		// 提取布伦特原油价格
		const brentPrice = $('.brent-price').text().trim(); // 假设页面中布伦特价格的类名为 .brent-price
		const brentChange = $('.brent-change').text().trim(); // 假设变化的类名为 .brent-change

		// 构造结果对象
		const result = {
			WTI美国原油价格: {
				price: parseFloat(wtiPrice),
				change: wtiChange
			},
			布伦特原油价格: {
				price: parseFloat(brentPrice),
				change: brentChange
			}
		};

		console.log('抓取结果:', result);
		return result;
	} catch (error) {
		console.error('抓取失败:', error.message);
		return null;
	}
}

const main = async () => {
	await fetchOilPrice();
};

main();
