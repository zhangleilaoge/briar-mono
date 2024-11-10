import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import md5 from 'md5-es';
import React from 'react';

import { checkUsername as checkUsernameApi, signUp } from '@/pages/briar/api/user';
import { LocalStorageKey } from '@/pages/briar/constants/env';

export type FieldType = {
	username: string;
	password?: string;
	passwordCheck?: string;
};

interface IRegisterProps {
	finishSignUp: () => void;
}

const Register: React.FC<IRegisterProps> = ({ finishSignUp }) => {
	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		message.loading({
			content: '注册中，请稍等。',
			duration: 0
		});
		const { accessToken } = await signUp({
			username: values.username,
			password: md5.hash(values.password || '')
		});
		message.destroy();
		message.success('注册成功，页面即将刷新。');

		localStorage.setItem(LocalStorageKey.AccessToken, accessToken);

		setTimeout(() => {
			window.location.reload();
		}, 1000);

		finishSignUp();
	};

	const beforeCheck: FormProps<FieldType>['onFinish'] = async (val: FieldType) => {
		const { username } = val;
		const { alreadyExists } = await checkUsernameApi(username);
		if (alreadyExists) {
			message.error('username already exists');
			return;
		}

		onFinish(val);
	};

	return (
		<>
			<Form
				onFinish={beforeCheck}
				style={{ minWidth: 280, display: 'flex', gap: 8, flexDirection: 'column' }}
				layout="vertical"
			>
				<Form.Item<FieldType>
					label="Username"
					name="username"
					rules={[
						{ required: true },
						{ min: 4, message: 'username must be at least 4 characters' },
						{ max: 16, message: 'username must be at most 16 characters' },
						{ pattern: /^[a-zA-Z0-9_]+$/, message: 'username must be alphanumeric' }
					]}
					validateTrigger="onBlur"
				>
					<Input />
				</Form.Item>
				<Form.Item<FieldType>
					label="Password"
					name="password"
					rules={[
						{ required: true },
						{ min: 6, message: 'password must be at least 6 characters' },
						{ max: 16, message: 'password must be at most 16 characters' },
						{ pattern: /^[a-zA-Z0-9_]+$/, message: 'password must be alphanumeric' }
					]}
					validateTrigger="onBlur"
				>
					<Input.Password />
				</Form.Item>
				<Form.Item<FieldType>
					label="PasswordCheck"
					name="passwordCheck"
					validateTrigger="onBlur"
					rules={[
						{ required: true },
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue('password') === value) {
									return Promise.resolve();
								}
								return Promise.reject(new Error('two passwords that you enter is inconsistent'));
							}
						})
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 12 }}
				>
					<Button htmlType="submit">Sign up</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default Register;
