import { zodResolver } from '@hookform/resolvers/zod';
import { useCountDown } from 'ahooks';
import { message } from 'antd';
import { VerifyScene } from 'briar-shared';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LocalStorageKey } from '@/constants';
import { checkUserInfo } from '@/pages/briar/api/user';
import { checkVerifyCode, sendVerifyCode4RetrievePassword } from '@/pages/briar/api/verify';
import { errorNotify } from '@/pages/briar/utils/notify';

import EmailAutoComplete from '../../register/email';

const retrievePasswordSchema = z.object({
	email: z.string().email('请输入有效邮箱'),
	verifyCode: z.string().min(1, '请输入验证码')
});

interface IRetrievePasswordStepProps {
	finishCheckCode: (email: string, code: string) => void;
}
type RetrievePasswordFormValues = z.infer<typeof retrievePasswordSchema>;

const RetrievePasswordStep: React.FC<IRetrievePasswordStepProps> = ({ finishCheckCode }) => {
	const [nextSendTime, setNextSendTime] = React.useState<number>(
		+(localStorage.getItem(LocalStorageKey.SendVerifyCode) || 0)
	);
	const [_, formattedRes] = useCountDown({
		targetDate: nextSendTime
	});
	const { seconds } = formattedRes;
	const [loading, setLoading] = React.useState(false);
	const [sending, setSending] = React.useState(false);

	const form = useForm<RetrievePasswordFormValues>({
		resolver: zodResolver(retrievePasswordSchema),
		defaultValues: {
			email: '',
			verifyCode: ''
		}
	});

	const sendVerifyCode = async () => {
		const email = form.getValues('email');

		if (!email) {
			form.setError('email', { message: '请先输入邮箱' });
			return;
		}

		setSending(true);
		try {
			const { alreadyExists } = await checkUserInfo('email', email);
			if (!alreadyExists) {
				form.setError('email', { message: '当前输入邮箱不存在' });
				return;
			}

			await sendVerifyCode4RetrievePassword(email);

			const nextSend = Date.now() + 60 * 1000;
			localStorage.setItem(LocalStorageKey.SendVerifyCode, nextSend.toString());
			setNextSendTime(nextSend);

			message.success('验证码已发送，请注意查收');
		} catch (err: any) {
			errorNotify(err);
		} finally {
			setSending(false);
		}
	};

	const onSubmit = async (values: RetrievePasswordFormValues) => {
		setLoading(true);
		try {
			const { result } = await checkVerifyCode({
				scene: VerifyScene.RetrievePassword,
				code: values.verifyCode,
				email: values.email
			});

			if (result) {
				finishCheckCode(values.email, values.verifyCode);
			} else {
				form.setError('verifyCode', { message: '验证码错误' });
			}
		} catch (err: any) {
			errorNotify(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{/* 邮箱 */}
				<FormField control={form.control} name="email" render={({}) => <EmailAutoComplete />} />

				{/* 验证码 */}
				<FormField
					control={form.control}
					name="verifyCode"
					render={({ field }) => (
						<FormItem>
							<FormLabel>验证码</FormLabel>
							<div className="flex space-x-2">
								<FormControl>
									<Input placeholder="请输入验证码" {...field} className="flex-1" />
								</FormControl>
								<Button
									type="button"
									variant="outline"
									onClick={sendVerifyCode}
									disabled={seconds > 0 || sending}
									className="whitespace-nowrap"
								>
									{sending ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : seconds > 0 ? (
										`已发送(${seconds}s)`
									) : (
										'发送验证码'
									)}
								</Button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* 提交按钮 */}
				<Button type="submit" className="w-full h-11" disabled={loading}>
					{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{loading ? '验证中...' : '下一步'}
				</Button>
			</form>
		</Form>
	);
};

export default RetrievePasswordStep;
