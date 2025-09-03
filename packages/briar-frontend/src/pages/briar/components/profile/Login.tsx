import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import md5 from 'md5-es';
import React from 'react';

import { LocalStorageKey } from '@/pages/briar/constants/env';
import { errorNotify } from '@/pages/briar/utils/notify';

import { login } from '../../api/auth';
import { PASSWORD_RULES } from '../../constants/validateRules';

export type FieldType = {
	username?: string;
	password?: string;
};

interface ILoginProps {
	finishSignIn: () => void;
	retrievePassword: () => void;
}

const Login: React.FC<ILoginProps> = ({ finishSignIn, retrievePassword }) => {
	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		message.loading({
			content: '登录中，请稍等。',
			duration: 0
		});
		const { accessToken } = await login({
			username: values.username || '',
			password: md5.hash(values.password || '')
		}).catch((err) => {
			message.destroy();
			errorNotify(err);
			return { accessToken: '' };
		});

		if (accessToken) {
			message.destroy();
			message.success('登录成功，页面即将刷新。');
			localStorage.setItem(LocalStorageKey.AccessToken, accessToken);
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}

		finishSignIn();
	};

	return (
		<>
			<Form
				onFinish={onFinish}
				style={{
					width: 472,
					display: 'flex',
					gap: 8,
					flexDirection: 'column',
					alignItems: 'center'
				}}
				requiredMark={false}
			>
				<Form.Item<FieldType>
					label="用户名"
					name="username"
					rules={[{ required: true }]}
					validateTrigger="onBlur"
					style={{ width: 280 }}
				>
					<Input />
				</Form.Item>
				<Form.Item<FieldType>
					label="密码"
					name="password"
					rules={PASSWORD_RULES}
					validateTrigger="onBlur"
					style={{ width: 280 }}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item style={{ width: 280, display: 'flex', justifyContent: 'center', marginTop: 12 }}>
					<div className="w-[240px] flex justify-between">
						<Button htmlType="submit" className="w-[88px]" type="primary">
							登录
						</Button>
						<Button onClick={() => retrievePassword()}>找回密码</Button>
					</div>
				</Form.Item>
				{/* <Divider plain>Additional Login Options</Divider>
				<Form.Item style={{ width: 280, display: 'flex', justifyContent: 'center', marginTop: 12 }}>
					<Button onClick={() => login()} type="primary" icon={<GoogleOutlined />}>
						Sign in with Google
					</Button>
				</Form.Item> */}
			</Form>
		</>
	);
};

export default Login;
