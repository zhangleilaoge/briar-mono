import { AutoCompleteProps } from 'antd';
import { useCallback, useState } from 'react';

const useAutoCompleteEmail = () => {
	const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
	const handleSearch = useCallback((value: string) => {
		setOptions(() => {
			if (!value || value.includes('@')) {
				return [];
			}
			return ['gmail.com', '163.com', 'qq.com'].map((domain) => ({
				label: `${value}@${domain}`,
				value: `${value}@${domain}`
			}));
		});
	}, []);

	return {
		options,
		handleSearch
	};
};

export default useAutoCompleteEmail;
