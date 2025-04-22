import { useRef } from 'react';

/*
 * @Description:
 * @Author: zhanglei
 * @Date: 2025-04-22 10:34:05
 * @LastEditTime: 2025-04-22 10:42:10
 * @LastEditors: zhanglei
 * @Reference:
 */
const useClock = () => {
	const lastRef = useRef(Date.now());

	const update = () => {
		const now = Date.now();
		const temp = lastRef.current;
		lastRef.current = now;
		return now - temp;
	};

	const getDelta = () => {
		return Date.now() - lastRef.current;
	};

	return {
		update,
		getDelta
	};
};

export default useClock;
