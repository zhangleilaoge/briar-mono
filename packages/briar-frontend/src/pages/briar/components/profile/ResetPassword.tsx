import { Button, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import md5 from 'md5-es';
import React, { useCallback } from 'react';

import { updatePassword } from '../../api/user';
import { PASSWORD_CHECK_RULES, PASSWORD_RULES } from '../../constants/validateRules';

export type FieldType = {
	password: string;
	confirm: string;
};

interface IResetPassword {
	finishReset: () => void;
	checkedEmail: string;
	checkedCode: string;
}

const ResetPassword: React.FC<IResetPassword> = ({ finishReset, checkedEmail, checkedCode }) => {
	const [form] = useForm();

	const beforeCheck = useCallback(
		async (val: FieldType) => {
			const { password } = val;

			await updatePassword({
				email: checkedEmail,
				verifyCode: checkedCode,
				password: md5.hash(password)
			});

			finishReset();
		},
		[checkedCode, checkedEmail, finishReset]
	);

	return (
		<>
			<Form
				onFinish={beforeCheck}
				style={{ minWidth: 280, display: 'flex', gap: 8, flexDirection: 'column' }}
				requiredMark={false}
				form={form}
			>
				<Form.Item<FieldType>
					label="新密码"
					name="password"
					rules={PASSWORD_RULES}
					validateTrigger="onBlur"
					style={{ width: 280 }}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item<FieldType>
					label="确认密码"
					name="confirm"
					rules={PASSWORD_CHECK_RULES}
					validateTrigger="onBlur"
					style={{ width: 280 }}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
					<Button htmlType="submit">确认修改</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default ResetPassword;
