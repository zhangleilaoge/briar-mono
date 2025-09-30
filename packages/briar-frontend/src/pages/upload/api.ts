import {
	IGetImgMaterialsRequest,
	IMaterial,
	IPageResult,
	IUploadBase64Response
} from 'briar-shared';

import { axiosInstance } from '@/apis/axios';

export const createImgMaterial = (data: { files: any[] }) =>
	axiosInstance.post('/material/createImgMaterial', data);

export const uploadBase64 = (data: { filename: string; base64: string }) =>
	axiosInstance.post<IUploadBase64Response>(`/material/uploadBase64`, data);

export const getImgMaterials = (data: IGetImgMaterialsRequest) =>
	axiosInstance.get<IPageResult<IMaterial>>(`/material/getImgMaterials`, {
		params: data
	});

export const deleteImgs = (data: { id: number; name: string }[]) =>
	axiosInstance.post('/material/deleteImgMaterials', {
		list: data
	});
