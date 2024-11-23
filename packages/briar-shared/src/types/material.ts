export interface IMaterial {
	id: number;
	name: string;
	type?: string;
	thumbUrl: string;
	userId?: number;
	url?: string;
	createdAt: string;
}

// ====================== response below ========================

export interface IUploadBase64Response {
	url: string;
}
