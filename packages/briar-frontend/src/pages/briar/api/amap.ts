import { getQueryFromObj, outerAlovaInstance } from './common';

interface IInputTip {
	key: string;
	keywords: string;
}

export const getInputTip = (params: IInputTip) =>
	outerAlovaInstance.Get<any>(
		`https://restapi.amap.com/v3/assistant/inputtips?${getQueryFromObj(params, '')}`
	);
