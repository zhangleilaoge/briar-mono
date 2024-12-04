import TinyPNG, { CompressResult } from 'tinypng-lib';

export const compressImg = async (file: File) => {
	// 检查文件类型
	const validTypes = ['image/jpeg', 'image/png'];
	if (!validTypes.includes(file.type)) {
		console.warn('文件类型不符合要求，只支持 JPEG 或 PNG 格式。');
		return file; // 返回原始文件，不进行压缩
	}

	// 进行压缩
	const res = (await TinyPNG.compress(file, {})) as CompressResult;

	return res.file;
};
