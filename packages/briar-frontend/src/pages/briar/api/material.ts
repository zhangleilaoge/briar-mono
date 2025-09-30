import {
	IGetImgMaterialsRequest,
	IMaterial,
	IPageResult,
	IUploadBase64Response
} from 'briar-shared';

import alovaInstance from './common';

export const uploadBase64 = (data: { filename: string; base64: string }) =>
	alovaInstance.Post<IUploadBase64Response>(`/material/uploadBase64`, data);

export const createImgMaterial = (data: { files: Pick<IMaterial, 'name' | 'thumbUrl'>[] }) =>
	alovaInstance.Post('/material/createImgMaterial', data);

export const getImgMaterials = (data: IGetImgMaterialsRequest) =>
	alovaInstance.Get<IPageResult<IMaterial>>(`/material/getImgMaterials`, {
		params: data
	});

export const deleteImgs = (data: { id: number; name: string }[]) =>
	alovaInstance.Post('/material/deleteImgMaterials', {
		list: data
	});
