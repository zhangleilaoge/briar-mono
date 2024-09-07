import { useEffect, useCallback, useRef, useState } from 'react';

const useLoadingDesc = () => {
	const dotsRef = useRef<string>('.');
	const [dots, setDots] = useState('.');
	const dotsTimer = useRef<ReturnType<typeof setTimeout>>();

	const updateDots = useCallback(() => {
		if (dotsRef.current.length === 3) {
			dotsRef.current = '.';
		} else {
			dotsRef.current = dotsRef.current + '.';
		}

		setDots(dotsRef.current);

		dotsTimer.current = setTimeout(updateDots, 1000);
	}, []);

	useEffect(() => {
		updateDots();

		return () => {
			clearTimeout(dotsTimer.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { desc: dots };
};

export default useLoadingDesc;
