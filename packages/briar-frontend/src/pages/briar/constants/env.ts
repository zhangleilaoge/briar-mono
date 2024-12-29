// @ts-ignore vite 环境变量
export const isDev = import.meta.env.MODE === 'development';

export enum LocalStorageKey {
	Sider = 'briar-sider',
	AccessToken = 'briar-access-token',
	CalculateResult = 'briar-calculate-result',
	SendVerifyCode = 'briar-send-verify-code',
	GptModel = 'briar-gpt-model'
}

export enum Language {
	Zh = 'zh-CN',
	En = 'en-US'
}
