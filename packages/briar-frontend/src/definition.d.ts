declare module '*.module.scss' {
	const classes: { [key: string]: string };
	export default classes;
}

declare interface Window {
	_AMapSecurityConfig: any;
	_global: Record<string, any>;
}

declare module 'prismjs';
