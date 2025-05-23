'use client';

import { useEffect } from 'react';

const Test = () => {
	useEffect(() => {
		// 仅在客户端执行
		console.log(window.location.href);
	}, []);
	return <div>Test</div>;
};
export default Test;
