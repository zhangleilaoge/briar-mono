import type { FormProps } from 'antd';
import { AutoComplete, Button, Form, Input, message } from 'antd';
import md5 from 'md5-es';
import React from 'react';

import { checkUserInfo as checkUserInfoApi, signUp } from '@/pages/briar/api/user';
import { LocalStorageKey } from '@/pages/briar/constants/env';

import { PASSWORD_CHECK_RULES, PASSWORD_RULES } from '../../constants/validateRules';
import useAutoCompleteEmail from '../../hooks/biz/useAutoCompleteEmail';

export type FieldType = {
	username: string;
	password?: string;
	passwordCheck?: string;
	mobile?: string;
	email?: string;
};

interface IRegisterProps {
	finishSignUp: () => void;
}

const Register: React.FC<IRegisterProps> = ({ finishSignUp }) => {
	const { options, handleSearch } = useAutoCompleteEmail();
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
		const { alreadyExists } = await checkUserInfoApi('username', username);
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
				requiredMark={false}
			>
				<Form.Item<FieldType>
					label="用户名"
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
					label="密码"
					name="password"
					rules={PASSWORD_RULES}
					validateTrigger="onBlur"
				>
					<Input.Password />
				</Form.Item>
				<Form.Item<FieldType>
					label="密码确认"
					name="passwordCheck"
					validateTrigger="onBlur"
					rules={PASSWORD_CHECK_RULES}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item<FieldType>
					label="邮箱(选填)"
					name="email"
					rules={[
						{ type: 'email', message: '请输入有效的邮箱地址' } // 验证邮箱格式
					]}
					validateTrigger="onBlur"
				>
					<AutoComplete onSearch={handleSearch} options={options} />
				</Form.Item>
				<Form.Item<FieldType>
					label="手机号(选填)"
					name="mobile"
					rules={[
						{
							pattern: /^[1][3-9][0-9]{9}$/,
							message: '请输入有效的手机号'
						}
					]}
					validateTrigger="onBlur"
				>
					<Input />
				</Form.Item>
				<Form.Item
					style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 12 }}
				>
					<Button htmlType="submit">注册</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default Register;
