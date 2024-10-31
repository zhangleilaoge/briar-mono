import { useDebounceFn } from 'ahooks';
import { useCallback, useState } from 'react';

import { getInputTip } from '@/pages/briar/api/amap';

const useLocationOption = () => {
	const [options, setOptions] = useState<
		{
			value: string;
			label: string;
		}[]
	>([]);
	const _onSearch = useCallback(async (keyword: string) => {
		const data = await getInputTip({ keywords: keyword, key: 'a82f0f04b69da69353ac8a298ec56a53' });
		setOptions(
			data?.tips?.map((tip: any) => {
				return { value: tip.name, label: tip.name };
			}) || []
		);
	}, []);
	const { run: onSearch } = useDebounceFn(_onSearch, {
		wait: 700
	});
	const clearOptions = () => {
		setOptions([]);
	};

	return {
		onSearch,
		clearOptions,
		options
	};
};

export default useLocationOption;
