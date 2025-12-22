import { useState } from 'react';

import { LocalStorageKey } from '@/constants';

import JsonEditor from '../components/JsonEditor';

export default function JsonEditorTab() {
	const [jsonText, _setJsonText] = useState<string>(
		localStorage.getItem(LocalStorageKey.JSON2) || ''
	);
	const [isValid, setIsValid] = useState<boolean>(true);

	const setJsonText = (text: string) => {
		_setJsonText(text);
		localStorage.setItem(LocalStorageKey.JSON2, text);
	};

	return (
		<JsonEditor
			jsonText={jsonText}
			setJsonText={setJsonText}
			isValid={isValid}
			setIsValid={setIsValid}
		/>
	);
}
