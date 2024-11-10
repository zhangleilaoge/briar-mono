import { IUploadBase64Response } from 'briar-shared';

import alovaInstance from './common';

export const uploadBase64 = (data: { filename: string; base64: string }) =>
	alovaInstance.Post<IUploadBase64Response>(`/material/uploadBase64`, data);
