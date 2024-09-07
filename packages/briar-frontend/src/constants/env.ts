// @ts-ignore vite 环境变量
export const isDev = import.meta.env.MODE === 'development';

export enum LocalStorageKey {
	Sider = 'briar-sider',
	FullScreen = 'briar-full-screen'
}
