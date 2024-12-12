import { IMaterial, THUMB_URL_SUFFIX } from 'briar-shared';
import { useState } from 'react';

import { uploadBase64 } from '../../api/material';
import { compressImg } from '../../utils/img';
import useNeedUpdate from '../useNeedUpdate';

interface IUseUploadImg {}

const useUploadImg = (_props?: IUseUploadImg) => {
	const [uploadList, setUploadList] = useState<Pick<IMaterial, 'name' | 'url' | 'thumbUrl'>[]>([]);
	const [loading, setLoading] = useState(false);
	const { needUpdate: uploadKey, triggerUpdate: resetUploadKey } = useNeedUpdate();

	/** @description 将待上传图片压缩，并上传 cdn */
	const customRequest: (options: any) => void = async ({ onSuccess, file }) => {
		setLoading(true);

		const reader = new FileReader();

		reader.readAsDataURL(await compressImg(file as File));

		reader.onload = async function () {
			const { url } = await uploadBase64({
				filename: file.name,
				base64: reader.result as string
			});

			setUploadList((pre) => [
				...pre,
				{
					name: file.name,
					thumbUrl: url + THUMB_URL_SUFFIX,
					url
				}
			]);

			setLoading(false);

			onSuccess?.('');
		};
	};

	/** @description 将待上传图片压缩，将其转为 base64 */
	// const compress2Base64: (options: any) => void = async ({ onSuccess, file }) => {
	// 	const reader = new FileReader();
	// 	setLoading(true);

	// 	reader.readAsDataURL(await compressImg(file as File));
	// 	reader.onload = async function () {
	// 		// 生成 base64 的 url
	// 		const base64String = reader.result as string; // 获取 Base64 字符串

	// 		setUploadList((pre) => [
	// 			...pre,
	// 			{
	// 				name: file.name,
	// 				thumbUrl: base64String,
	// 				url: base64String
	// 			}
	// 		]);

	// 		setLoading(false);

	// 		onSuccess?.('');
	// 	};
	// };

	return {
		uploadList,
		loading,
		uploadKey,
		resetUploadKey,
		setUploadList,
		customRequest
	};
};

export default useUploadImg;
