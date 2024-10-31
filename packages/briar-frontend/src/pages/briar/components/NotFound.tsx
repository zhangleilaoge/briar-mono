import { useEffect } from 'react';

const NotFoundRedirect = ({ fullUrl }: { fullUrl: string }) => {
	useEffect(() => {
		window.location.href = fullUrl;
	}, [fullUrl]);

	return null; // 组件不渲染任何内容
};

export default NotFoundRedirect;
