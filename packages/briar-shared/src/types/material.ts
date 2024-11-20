export interface IMaterial {
	id: number;
	name: string;
	type?: string;
	thumbUrl: string;
	userId?: number;
}

// ====================== response below ========================

export interface IUploadBase64Response {
	url: string;
}
