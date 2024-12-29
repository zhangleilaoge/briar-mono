import { ModelEnum } from 'briar-shared';
import { safeJSON } from 'openai/core';
import { useState } from 'react';

import { LocalStorageKey } from '@/pages/briar/constants/env';

const useGptModel = () => {
	const options = [
		{ value: ModelEnum.Gpt4oMini, label: ModelEnum.Gpt4oMini },
		{
			value: ModelEnum.Gpt4o,
			label: ModelEnum.Gpt4o
		}
	];
	const [selectOption, setSelectOption] = useState(
		safeJSON(localStorage.getItem(LocalStorageKey.GptModel) || '') || options[0]
	);
	const onChange = (value: ModelEnum) => {
		const opt = options.find((option) => option.value === value) || options[0];
		setSelectOption(opt);
		localStorage.setItem(LocalStorageKey.GptModel, JSON.stringify(opt));
	};

	return { selectOption, options, onChange };
};

export default useGptModel;
