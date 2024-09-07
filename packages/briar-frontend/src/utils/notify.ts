import { message } from 'antd';

export const errorNotify = (error: any) => {
	const errStr = error?.message || error?.msg || error?.error || JSON.stringify(error);

	if (['"SSE Error"'].includes(errStr)) return;

	message.error(errStr);
};
