import React from 'react';
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, message } from 'antd';
import md5 from 'md5-es';
import { authenticateUserByGoogle, signIn } from '@/api/user';

import s from './style.module.scss';
import { useGoogleLogin } from '@react-oauth/google';
import { LocalStorageKey } from '@/constants/env';
import { errorNotify } from '@/utils/notify';
import { GoogleOutlined } from '@ant-design/icons';

export type FieldType = {
	username?: string;
	password?: string;
};

interface ILoginProps {
	finishSignIn: () => void;
}

const Login: React.FC<ILoginProps> = ({ finishSignIn }) => {
	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		message.loading({
			content: '登录中，请稍等。',
			duration: 0
		});
		const { accessToken } = await signIn({
			username: values.username,
			password: md5.hash(values.password || '')
		});
		message.destroy();
		if (accessToken) {
			message.success('登录成功，页面即将刷新。');
			localStorage.setItem(LocalStorageKey.AccessToken, accessToken);
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}

		finishSignIn();
	};

	const login = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			const googleAccessToken = tokenResponse.access_token;
			const accessToken = await authenticateUserByGoogle(googleAccessToken);
			console.log('google response: ', tokenResponse);

			if (accessToken) {
				message.success('登录成功，页面即将刷新。');
				localStorage.setItem(LocalStorageKey.AccessToken, accessToken);
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			} else errorNotify('登录失败。');
		},
		onError: (err) => {
			console.log('Login Failed', err);
			alert('登录失败。');
		}
	});

	return (
		<>
			<img
				src="https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/apple-touch-icon.png"
				style={{ width: 64, height: 64 }}
			/>
			<h1 className={s.SignText}>Sign in to Briar</h1>
			<Form
				onFinish={onFinish}
				style={{
					width: 472,
					display: 'flex',
					gap: 8,
					flexDirection: 'column',
					alignItems: 'center'
				}}
				layout="vertical"
			>
				<Form.Item<FieldType>
					label="Username"
					name="username"
					rules={[{ required: true }]}
					validateTrigger="onBlur"
					style={{ width: 280 }}
				>
					<Input />
				</Form.Item>
				<Form.Item<FieldType>
					label="Password"
					name="password"
					rules={[{ required: true }]}
					validateTrigger="onBlur"
					style={{ width: 280 }}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item style={{ width: 280, display: 'flex', justifyContent: 'center', marginTop: 12 }}>
					<Button htmlType="submit">Sign in</Button>
				</Form.Item>
				<Divider plain>Additional Login Options</Divider>
				<Form.Item style={{ width: 280, display: 'flex', justifyContent: 'center', marginTop: 12 }}>
					<Button onClick={() => login()} type="primary" icon={<GoogleOutlined />}>
						Sign in with Google
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default Login;
