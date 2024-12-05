import { AutoCompleteProps } from 'antd';
import { useCallback, useState } from 'react';

const EMAIL_SUFFIX = [
	'gmail.com',
	'yahoo.com',
	'outlook.com',
	'hotmail.com',
	'163.com',
	'qq.com',
	'126.com',
	'live.com',
	'icloud.com',
	'mail.com',
	'zoho.com',
	'protonmail.com',
	'fastmail.com',
	'ymail.com',
	'aol.com'
];

/** @description 输入框自动补充邮箱后缀 */
const useAutoCompleteEmail = () => {
	const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
	const handleSearch = useCallback((value: string) => {
		setOptions(() => {
			if (!value || value.includes('@')) {
				return [];
			}
			return EMAIL_SUFFIX.map((domain) => ({
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
