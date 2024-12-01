import { isNil } from 'lodash';

export const safeJsonParse = (str: string) => {
	try {
		return JSON.parse(str);
	} catch (_) {
		return;
	}
};

export const safePromise = async <T>(promise: Promise<T>): Promise<[any, T | null]> => {
	try {
		const result = await promise;
		return [null, result];
	} catch (error) {
		return [error, null];
	}
};

export function getFileExtension(url: string) {
	// 去掉查询部分
	const baseUrl = url.split('?')[0];

	// 找到最后一个 '.' 的位置
	const lastDotIndex = baseUrl.lastIndexOf('.');

	// 如果找到了 '.' 并且不是在URL的开头
	if (lastDotIndex !== -1 && lastDotIndex !== baseUrl.length - 1) {
		return baseUrl.substring(lastDotIndex + 1); // 返回后缀名（不含 '.'）
	} else {
		return ''; // 如果没有找到后缀
	}
}

export const filterDummy = (value: any) => {
	if (
		isNil(value) ||
		value === 'null' ||
		value === 'undefined' ||
		value === 'NULL' ||
		value === 'UNDEFINED'
	) {
		return false;
	}

	return true;
};

export const filterDummyObj = (obj: Record<string, any>) => {
	return Object.fromEntries(Object.entries(obj).filter(([_, value]) => filterDummy(value)));
};
