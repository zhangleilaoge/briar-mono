import { useEffect } from 'react';

const useDisableMouseEvent = () => {
	useEffect(() => {
		const handleMouseDown = (e: any) => {
			if (e.shiftKey && e.button === 0) {
				e.preventDefault();
			}
		};

		// 添加事件监听器
		document.addEventListener('mousedown', handleMouseDown);

		// 清除事件监听器
		return () => {
			document.removeEventListener('mousedown', handleMouseDown);
		};
	}, []); // 依赖数组为空，表示只在组件挂载和卸载时执行
};

export default useDisableMouseEvent;
