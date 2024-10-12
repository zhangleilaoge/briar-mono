declare module '*.module.scss' {
	const classes: { [key: string]: string };
	export default classes;
}

declare interface Window {
	_AMapSecurityConfig: any;
}

declare module 'prismjs';
