import { IPageResult } from './common';

export interface IJsonDocumentDTO {
	id: number;
	name: string;
	content: string;
	userId: number;
	contentSize: number;
	views: number;
	isFavorite: boolean;
	description?: string;
	docType: string;
	shareRange: string;
	createdAt: string;
	updatedAt: string;
}

export interface IJsonVersionDTO {
	id: number;
	documentId: number;
	version: number;
	content: string;
	changeLog?: string;
	createdAt: string;
}

export interface IJsonOperationLogDTO {
	id: number;
	documentId: number;
	operationType: string;
	operatorId: number;
	details?: string;
	createdAt?: string;
}

export interface IJsonStatsDTO {
	totalDocuments: number;
	totalSize: number;
	monthlyRequests: number;
	storageUsed: number;
	storageLimit: number;
	recentLogs: IJsonOperationLogDTO[];
}

// ====================== request below ========================

export interface ICreateJsonRequest {
	name: string;
	content: string;
	description?: string;
	docType?: string;
}

export interface IUpdateJsonRequest {
	name?: string;
	content?: string;
	description?: string;
	docType?: string;
	contentSize?: number;
}

export interface IGetJsonListRequest {
	page: number;
	pageSize: number;
	keyword?: string;
}

export interface IJsonListResponse {
	items: IJsonDocumentDTO[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface IRestoreVersionRequest {
	documentId: number;
	versionId: number;
}

// ====================== response below ========================

export type IGetJsonListResponse = IPageResult<
	IJsonDocumentDTO & {
		isFavorite: boolean;
	}
>;

export interface IGetJsonResponse {
	success: boolean;
	data: IJsonDocumentDTO;
}

export interface ICreateJsonResponse {
	success: boolean;
	data: {
		id: number;
		name: string;
		content: string;
		createdAt: string;
		updatedAt: string;
	};
}

export interface IUpdateJsonResponse {
	success: boolean;
	data: {
		id: number;
		name: string;
		content: string;
		updatedAt: string;
	};
}

export interface ICommonJsonResponse {
	success: boolean;
}

export interface IGetJsonStatsResponse {
	success: boolean;
	data: IJsonStatsDTO;
}

export interface IGetJsonVersionsResponse {
	success: boolean;
	data: IJsonVersionDTO[];
}

export interface IToggleFavoriteResponse {
	success: boolean;
	data: {
		id: number;
		isFavorite: boolean;
	};
}
