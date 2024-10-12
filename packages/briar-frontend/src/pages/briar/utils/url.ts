export enum QueryKeyEnum {
	DisplayMode = 'displayMode',
	AmapKey = 'amapKey',
	AmapToken = 'amapToken'
}

interface IUrlParams {
	[QueryKeyEnum.DisplayMode]?: 'normal' | 'full';
	[QueryKeyEnum.AmapKey]?: string;
	[QueryKeyEnum.AmapToken]?: string;
}

export const getUrlParams = (url = window.location.href): IUrlParams => {
	const urlObj = new URL(url);
	const urlSearchParams = urlObj.searchParams;
	const paramObj = Object.fromEntries(urlSearchParams);
	return paramObj;
};

export function updateURLParameter(
	params: Record<string, string | undefined | null>,
	silent = true
) {
	// 获取当前 URL
	const url = new URL(window.location.href);

	Object.entries(params).forEach(([key, value]) => {
		if (!value) {
			url.searchParams.delete(key);
		} else {
			url.searchParams.set(key, value);
		}
	});

	// 使用 History API 更新浏览器的地址栏，不刷新页面
	silent ? window.history.pushState({}, '', url) : (window.location.href = url.toString());

	return url.toString();
}
