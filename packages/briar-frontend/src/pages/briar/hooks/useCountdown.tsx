import { useEffect, useState } from 'react';

export const useCountdown = (initialValue = 60) => {
	const [count, setCount] = useState(initialValue);

	useEffect(() => {
		if (count > 0) {
			const timeout = setTimeout(() => {
				setCount(count - 1); // 每秒将计数减1
			}, 1000);

			return () => clearTimeout(timeout); // 清除定时器
		}
	}, [count]); // 当 count 变化时重新运行 Effect

	return { count };
};
