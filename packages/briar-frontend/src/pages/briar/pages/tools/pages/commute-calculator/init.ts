import AMapLoader from '@amap/amap-jsapi-loader';

const DEFAULT_KEY = '66f986e3f2c27331f9f55c60a5bd7689';
const DAFAULT_TOKEN = 'bcfb91afee148295929a226899ccb27b';

// const key2 = 'd442bce78bb4568ebf51c562c434664a';
// const token2 = '0c3bb7fdd9c79ede38a0c4a5dfec8b6e';

export const init = (key = DEFAULT_KEY, token = DAFAULT_TOKEN) => {
	window._AMapSecurityConfig = {
		securityJsCode: token
	};
	return AMapLoader.load({
		key, //申请好的 Web 端开发者 Key，首次调用 load 时必填
		version: '2.0', //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
		plugins: ['AMap.Scale', 'AMap.Transfer', 'AMap.Driving', 'AMap.Riding'] //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['AMap.Scale','...','...']
	})
		.then((AMap) => {
			new AMap.Map('amap-container'); //"container"为 <div> 容器的 id

			AMap.plugin('AMap.Transfer', function () {});
			AMap.plugin('AMap.Driving', function () {});
			AMap.plugin('AMap.Riding', function () {});
			return AMap;
		})
		.catch((e) => {
			console.log(e);
		});
};
