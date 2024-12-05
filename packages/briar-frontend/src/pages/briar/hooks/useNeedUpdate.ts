import { useCallback, useState } from 'react';

/** @description 对外暴露更新标识符 */
const useNeedUpdate = () => {
	const [needUpdate, set] = useState<number | undefined>();

	const triggerUpdate = useCallback(() => {
		set(Math.random());
	}, []);

	const finishUpdate = useCallback(() => {
		set(undefined);
	}, []);

	return { needUpdate, triggerUpdate, finishUpdate };
};

export default useNeedUpdate;
