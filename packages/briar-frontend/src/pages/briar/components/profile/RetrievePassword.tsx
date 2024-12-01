import useCountDown from 'ahooks/lib/useCountDown';
import type { FormProps } from 'antd';
import { AutoComplete, Button, Col, Form, Input, message, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { VerifyScene } from 'briar-shared';
import React, { useState } from 'react';

import { LocalStorageKey } from '@/pages/briar/constants/env';

import { checkUserInfo } from '../../api/user';
import { checkVerifyCode, sendVerifyCode4RetrievePassword } from '../../api/verify';
import useAutoCompleteEmail from '../../hooks/biz/useAutoCompleteEmail';
import { errorNotify } from '../../utils/notify';

export type FieldType = {
	verifyCode?: string;
	username?: string;
	email?: string;
};

interface IRetrievePassword {
	finishCheckCode: (email: string, code: string) => void;
}

const RetrievePassword: React.FC<IRetrievePassword> = ({ finishCheckCode }) => {
	const [form] = useForm();
	const [nextSendTime, setNextSendTime] = React.useState<number>(
		+(localStorage.getItem(LocalStorageKey.SendVerifyCode) || 0)
	);
	const [_, formattedRes] = useCountDown({
		targetDate: nextSendTime
	});
	const { seconds } = formattedRes;
	const [checkedEmail, setCheckedEmail] = useState<string>('');
	const { options, handleSearch } = useAutoCompleteEmail();

	const onFinish: FormProps<FieldType>['onFinish'] = async (vals) => {
		finishCheckCode(checkedEmail, vals.verifyCode!);
	};

	const sendVerifyCode = async () => {
		const { email } = form.getFieldsValue();
		// 这里还有问题，邮箱校验总是失败，后面排查下
		if (!email) {
			message.error('请先输入邮箱');
			return;
		}

		const { alreadyExists } = await checkUserInfo('email', email);
		if (!alreadyExists) {
			message.error('当前输入邮箱不存在');
			return;
		}

		sendVerifyCode4RetrievePassword(email)
			.then(() => {
				message.success('验证码发送成功，请注意查收');
				const nextSend = Date.now() + 60 * 1000;
				localStorage.setItem(LocalStorageKey.SendVerifyCode, nextSend.toString());
				setNextSendTime(nextSend);
			})
			.catch((err) => {
				errorNotify(err);
			})
			.then(() => {
				setCheckedEmail(email);
			});
	};

	const beforeCheck: FormProps<FieldType>['onFinish'] = async (val: FieldType) => {
		const { verifyCode } = val;
		if (!verifyCode) {
			message.error('请输入验证码');
		}

		// 校验验证码有效性
		checkVerifyCode({
			scene: VerifyScene.RetrievePassword,
			code: verifyCode!,
			email: checkedEmail
		})
			.then(({ result }) => {
				if (result) {
					onFinish(val);
					return;
				}

				message.error('验证码错误');
			})
			.catch((err) => {
				errorNotify(err);
			});
	};

	return (
		<>
			<Form
				onFinish={beforeCheck}
				style={{ minWidth: 280, display: 'flex', gap: 8, flexDirection: 'column' }}
				requiredMark={false}
				form={form}
			>
				<Form.Item<FieldType>
					label="邮箱"
					name="email"
					rules={[{ required: true }, { type: 'email' }]}
					validateTrigger="onBlur"
					style={{ width: 280 }}
				>
					<AutoComplete onSearch={handleSearch} options={options} />
				</Form.Item>
				<Form.Item<FieldType> label="验证码" rules={[{ required: true }]} validateTrigger="onBlur">
					<Row gutter={8}>
						<Col span={16}>
							<Form.Item
								name="verifyCode"
								noStyle
								rules={[{ required: true, message: 'Please input the captcha you got!' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={8}>
							{seconds > 0 ? (
								<Button type="primary" disabled>
									已发送{`(${seconds}s)`}
								</Button>
							) : (
								<Button type="primary" onClick={sendVerifyCode}>
									发送验证码
								</Button>
							)}
						</Col>
					</Row>
				</Form.Item>
				<Form.Item style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
					<Button htmlType="submit">下一步</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default RetrievePassword;
