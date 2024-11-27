import { WechatOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, message } from 'antd';
import md5 from 'md5-es';
import React, { useState } from 'react';

import { signIn } from '@/pages/briar/api/user';
import { LocalStorageKey } from '@/pages/briar/constants/env';
import { errorNotify } from '@/pages/briar/utils/notify';

import useWxLogin from './hooks/useWxLogin';

export type FieldType = {
	username?: string;
	password?: string;
};

interface ILoginProps {
	finishSignIn: () => void;
}

const Login: React.FC<ILoginProps> = ({ finishSignIn }) => {
	const { code, imgCode, fetchCode } = useWxLogin();

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		message.loading({
			content: '登录中，请稍等。',
			duration: 0
		});
		const { accessToken } = await signIn({
			username: values.username,
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

	// const login = useGoogleLogin({
	// 	onSuccess: async (tokenResponse) => {
	// 		const googleAccessToken = tokenResponse.access_token;
	// 		const accessToken = await authenticateUserByGoogle(googleAccessToken);
	// 		console.log('google response: ', tokenResponse);
	// 		console.log('accessToken: ', accessToken);

	// 		if (accessToken) {
	// 			message.success('登录成功，页面即将刷新。');
	// 			localStorage.setItem(LocalStorageKey.AccessToken, accessToken);
	// 			setTimeout(() => {
	// 				window.location.reload();
	// 			}, 1000);
	// 		} else errorNotify('登录失败。');
	// 	},
	// 	onError: (err) => {
	// 		console.log('Login Failed', err);
	// 		alert('登录失败。');
	// 	}
	// });

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
				layout="vertical"
			>
				<Form.Item<FieldType>
					label="帐号"
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
					rules={[{ required: true }]}
					validateTrigger="onBlur"
					style={{ width: 280 }}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item style={{ width: 280, display: 'flex', justifyContent: 'center', marginTop: 12 }}>
					<Button htmlType="submit">登录</Button>
				</Form.Item>
				<Divider plain>其他登录方式</Divider>
				<Form.Item style={{ width: 280, display: 'flex', justifyContent: 'center', marginTop: 12 }}>
					{/* <Button onClick={() => login()} type="primary" icon={<GoogleOutlined />}>
						Sign in with Google
					</Button> */}
					<Button
						type="primary"
						icon={<WechatOutlined />}
						onClick={fetchCode}
						className="bg-[#05c161] text-white hover:!bg-[#37cd81] transition-colors"
					>
						微信扫码登录
					</Button>
				</Form.Item>
				<div className="mb-[12px]">
					{code ? <img src={code} alt="" className="w-[100px] h-[100px]" /> : null}
				</div>
			</Form>
		</>
	);
};

export default Login;
