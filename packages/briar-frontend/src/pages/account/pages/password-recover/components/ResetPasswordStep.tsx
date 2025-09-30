import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import md5 from 'md5-es';
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
import { updatePassword } from '@/pages/briar/api/user';
import { errorNotify } from '@/pages/briar/utils/notify';

const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(6, '密码至少6位')
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, '需包含大小写字母及数字'),
		confirm: z.string()
	})
	.refine((data) => data.password === data.confirm, {
		message: '两次密码不一致',
		path: ['confirm']
	});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface IResetPasswordStepProps {
	finishReset: () => void;
	checkedEmail: string;
	checkedCode: string;
	onBack: () => void;
}

const ResetPasswordStep: React.FC<IResetPasswordStepProps> = ({
	finishReset,
	checkedEmail,
	checkedCode,
	onBack
}) => {
	const [loading, setLoading] = React.useState(false);

	const form = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			confirm: ''
		}
	});

	const onSubmit = async (values: ResetPasswordFormValues) => {
		setLoading(true);
		try {
			await updatePassword({
				email: checkedEmail,
				verifyCode: checkedCode,
				password: md5.hash(values.password)
			});

			console.log('密码修改成功，请尝试重新登录。');
			finishReset();
		} catch (err: any) {
			errorNotify(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{/* 新密码 */}
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>新密码</FormLabel>
							<FormControl>
								<Input type="password" placeholder="至少6位，含大小写字母及数字" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* 确认密码 */}
				<FormField
					control={form.control}
					name="confirm"
					render={({ field }) => (
						<FormItem>
							<FormLabel>确认密码</FormLabel>
							<FormControl>
								<Input type="password" placeholder="再次输入新密码" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* 按钮组 */}
				<div className="flex space-x-2">
					<Button type="button" variant="outline" onClick={onBack} className="flex-1">
						上一步
					</Button>
					<Button type="submit" className="flex-1" disabled={loading}>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{loading ? '修改中...' : '确认修改'}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default ResetPasswordStep;
