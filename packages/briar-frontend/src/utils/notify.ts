import { message } from 'antd';

export const errorNotify = (error: any) => {
	message.error(error?.message || error?.msg || error?.error || JSON.stringify(error));
};
