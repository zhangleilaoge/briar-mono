import { safeJSON } from 'openai/core';
import { useEffect, useState } from 'react';

import { getConversationModels } from '@/pages/briar/api/ai';
import { LocalStorageKey } from '@/pages/briar/constants/env';

const useGptModel = () => {
	const [options, setOptions] = useState([{ value: 'gpt-4o', label: 'gpt-4o' }]);
	const [selectOption, setSelectOption] = useState(
		safeJSON(localStorage.getItem(LocalStorageKey.GptModel) || '') || options[0]
	);
	const onChange = (value: string) => {
		const opt = options.find((option) => option.value === value) || options[0];
		setSelectOption(opt);
		localStorage.setItem(LocalStorageKey.GptModel, JSON.stringify(opt));
	};

	useEffect(() => {
		getConversationModels().then((models) => {
			setOptions(models.map((model) => ({ value: model.id, label: model.id })));
		});
	}, []);

	return { selectOption, options, onChange };
};

export default useGptModel;
