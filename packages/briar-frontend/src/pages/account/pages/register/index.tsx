import { zodResolver } from '@hookform/resolvers/zod';
import { message } from 'antd';
import { Loader2 } from 'lucide-react';
import md5 from 'md5-es';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { checkUserInfo as checkUserInfoApi, signUp } from '@/pages/briar/api/user';

import useRedirect from '../../hooks/useRedirect';
import EmailAutoComplete from './email';

/* ---------------- 校验 schema ---------------- */
const registerSchema = z
	.object({
		username: z
			.string()
			.min(4, '用户名至少 4 位')
			.max(16, '用户名最多 16 位')
			.regex(/^[a-zA-Z0-9_]+$/, '仅支持字母、数字、下划线'),
		password: z
			.string()
			.min(6, '密码至少 6 位')
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, '需包含大小写字母及数字'),
		passwordCheck: z.string(),
		email: z.string().email('请输入有效邮箱').optional().or(z.literal('')),
		mobile: z
			.string()
			.regex(/^[1][3-9][0-9]{9}$/, '请输入有效手机号')
			.optional()
			.or(z.literal(''))
	})
	.refine((data) => data.password === data.passwordCheck, {
		message: '两次密码不一致',
		path: ['passwordCheck']
	});

type RegisterFormValues = z.infer<typeof registerSchema>;

/* ---------------- 组件 ---------------- */
interface IRegisterProps {
	finishSignUp: () => void;
}

const Register: React.FC<IRegisterProps> = ({ finishSignUp }) => {
	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: '',
			password: '',
			passwordCheck: '',
			email: '',
			mobile: ''
		}
	});

	const [loading, setLoading] = React.useState(false);
	const { redirect } = useRedirect();

	const onSubmit = async (values: RegisterFormValues) => {
		setLoading(true);
		message.loading('注册中，请稍等…');
		try {
			const { accessToken } = await signUp({
				username: values.username,
				password: md5.hash(values.password)
			});
			message.success('注册成功，页面即将刷新');
			localStorage.setItem(LocalStorageKey.AccessToken, accessToken);
			setTimeout(() => {
				redirect();
			}, 1000);
			finishSignUp();
		} catch (err: any) {
			message.error(err.message || '注册失败，请重试');
		} finally {
			setLoading(false);
			message.destroy();
		}
	};

	const checkUsername = async () => {
		const username = form.getValues('username');
		if (!username) return;
		const { alreadyExists } = await checkUserInfoApi('username', username);
		if (alreadyExists) {
			form.setError('username', { message: '用户名已存在' });
		} else {
			form.clearErrors('username');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-bold">用户注册</CardTitle>
					<CardDescription>填写信息完成注册</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							{/* 用户名 */}
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>用户名</FormLabel>
										<FormControl>
											<Input
												placeholder="4-16 位字母、数字、下划线"
												{...field}
												onBlur={checkUsername}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* 密码 */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>密码</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="至少 6 位，含大小写字母及数字"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* 确认密码 */}
							<FormField
								control={form.control}
								name="passwordCheck"
								render={({ field }) => (
									<FormItem>
										<FormLabel>确认密码</FormLabel>
										<FormControl>
											<Input type="password" placeholder="再次输入密码" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* 邮箱（带自动补全） */}
							<FormField
								control={form.control}
								name="email"
								render={({}) => <EmailAutoComplete />}
							/>

							{/* 手机号 */}
							<FormField
								control={form.control}
								name="mobile"
								render={({ field }) => (
									<FormItem>
										<FormLabel>手机号（选填）</FormLabel>
										<FormControl>
											<Input placeholder="" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* 提交 */}
							<Button type="submit" className="w-full h-11" disabled={loading}>
								{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{loading ? '注册中…' : '注册'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Register;
