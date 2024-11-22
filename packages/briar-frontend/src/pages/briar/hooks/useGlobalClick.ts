import { useEffect, useRef } from 'react';

const useGlobalClick = (callback: () => void) => {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>();
	const cancelNextRef = useRef(false);

	useEffect(() => {
		const handleClick = () => {
			// 清除之前的定时器
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}

			if (cancelNextRef.current) {
				cancelNextRef.current = false;
				return;
			}
			// 设置一个新的定时器
			timerRef.current = setTimeout(() => {
				callback();
			}, 100);
		};

		// 添加全局点击事件监听
		document.addEventListener('click', handleClick);

		// 清除事件监听和定时器
		return () => {
			document.removeEventListener('click', handleClick);
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, []);

	// 返回一个取消方法
	const cancel = () => {
		cancelNextRef.current = true;
	};

	return { cancel };
};

export default useGlobalClick;
