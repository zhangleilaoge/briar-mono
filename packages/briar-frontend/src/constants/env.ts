// @ts-ignore vite 环境变量
export const isDev = import.meta.env.MODE === 'development';

export enum LocalStorageKey {
	Conversation = 'briar-conversation-list',
	Sider = 'briar-sider',
	FullScreen = 'briar-full-screen',
	userInfo = 'briar-user-info'
}
