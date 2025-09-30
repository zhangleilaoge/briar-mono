import { message } from 'antd';
import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import ResetPasswordStep from './components/ResetPasswordStep';
import RetrievePasswordStep from './components/RetrievePasswordStep';

/* ---------------- 组件状态类型 ---------------- */
type PasswordRecoveryStep = 'verify' | 'reset';

/* ---------------- 主组件 ---------------- */
const PasswordRecovery: React.FC<{ jump: (path: string) => void }> = ({ jump }) => {
	const [step, setStep] = React.useState<PasswordRecoveryStep>('verify');
	const [verifiedEmail, setVerifiedEmail] = React.useState('');
	const [verifiedCode, setVerifiedCode] = React.useState('');

	const handleFinishCheckCode = (email: string, code: string) => {
		setVerifiedEmail(email);
		setVerifiedCode(code);
		setStep('reset');
	};

	const handleFinishReset = () => {
		// 可以跳转到登录页或其他操作
		jump('/login');
		message.success('密码重设成功，请重新登录');
	};

	const handleBackToVerify = () => {
		setStep('verify');
		setVerifiedEmail('');
		setVerifiedCode('');
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-bold">
						{step === 'verify' ? '找回密码' : '重设密码'}
					</CardTitle>
					<CardDescription>
						{step === 'verify' ? '请输入邮箱和验证码验证身份' : '请输入您的新密码'}
					</CardDescription>
				</CardHeader>

				<CardContent>
					{step === 'verify' ? (
						<RetrievePasswordStep finishCheckCode={handleFinishCheckCode} />
					) : (
						<ResetPasswordStep
							finishReset={handleFinishReset}
							checkedEmail={verifiedEmail}
							checkedCode={verifiedCode}
							onBack={handleBackToVerify}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default PasswordRecovery;
