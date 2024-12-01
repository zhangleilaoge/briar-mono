import { RuleObject } from 'antd/es/form';
import { NamePath, StoreValue } from 'antd/es/form/interface';

export const PASSWORD_RULES = [
	{ required: true },
	{ min: 6, message: 'password must be at least 6 characters' },
	{ max: 16, message: 'password must be at most 16 characters' },
	{ pattern: /^[a-zA-Z0-9_]+$/, message: 'password must be alphanumeric' }
];

export const PASSWORD_CHECK_RULES = [
	{ required: true },
	({ getFieldValue }: { getFieldValue: (name: NamePath) => StoreValue }) => ({
		validator(_: RuleObject, value: any) {
			if (!value || getFieldValue('password') === value) {
				return Promise.resolve();
			}
			return Promise.reject(new Error('two passwords that you enter is inconsistent'));
		}
	})
];
