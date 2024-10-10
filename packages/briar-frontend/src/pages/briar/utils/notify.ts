import { message } from 'antd';

export const errorNotify = (
	error: any,
	option: {
		prefix?: string;
	} = {
		prefix: ''
	}
) => {
	const errStr = error?.message || error?.msg || error?.error || JSON.stringify(error);

	if (['"SSE Error"'].includes(errStr)) return;

	message.error(option?.prefix + errStr);
};
