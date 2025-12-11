import {
	ICreateJsonRequest,
	IJsonDocumentDTO,
	IJsonListResponse,
	IJsonStatsDTO,
	IJsonVersionDTO,
	IUpdateJsonRequest
} from 'briar-shared';

import { axiosInstance } from '@/apis/axios';

// Re-export types for use in components
export type { IJsonDocumentDTO, IJsonStatsDTO, IJsonVersionDTO };

export interface JsonDocument {
	id: number;
	name: string;
	content: string;
	views?: number;
	contentSize?: number;
	isFavorite?: boolean;
	createdAt: string;
	updatedAt: string;
}

// 创建 JSON 文档
export const createJsonDocument = async (data: ICreateJsonRequest): Promise<JsonDocument> => {
	return axiosInstance.post('/json/create', data).then((res: any) => res.data);
};

// 获取 JSON 文档列表
export const getJsonDocuments = async (params?: {
	page?: number;
	pageSize?: number;
	keyword?: string;
}): Promise<IJsonListResponse> => {
	return axiosInstance.get('/json/list', { params }).then((res: any) => res.data);
};

// 获取单个 JSON 文档
export const getJsonDocument = async (id: number): Promise<JsonDocument> => {
	return axiosInstance.get(`/json/${id}`).then((res: any) => res.data);
};

// 更新 JSON 文档
export const updateJsonDocument = async (
	id: number,
	data: IUpdateJsonRequest
): Promise<JsonDocument> => {
	return axiosInstance.put(`/json/${id}`, data).then((res: any) => res.data);
};

// 删除 JSON 文档
export const deleteJsonDocument = async (id: number): Promise<void> => {
	return axiosInstance.delete(`/json/${id}`).then((res: any) => res.data);
};

// 切换收藏状态
export const toggleJsonFavorite = async (
	id: number
): Promise<{ id: number; isFavorite: boolean }> => {
	return axiosInstance.post(`/json/${id}/favorite`).then((res: any) => res.data);
};

// 获取用户统计数据
export const getJsonStats = async (): Promise<IJsonStatsDTO> => {
	return axiosInstance.get('/json/stats/overview').then((res: any) => res.data);
};

// 获取文档版本历史
export const getJsonVersionHistory = async (id: number): Promise<IJsonVersionDTO[]> => {
	return axiosInstance.get(`/json/${id}/versions`).then((res: any) => res.data);
};

// 恢复到指定版本
export const restoreJsonVersion = async (id: number, versionId: number): Promise<JsonDocument> => {
	return axiosInstance.post(`/json/${id}/restore/${versionId}`).then((res: any) => res.data);
};
