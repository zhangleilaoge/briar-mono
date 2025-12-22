import { zodResolver } from '@hookform/resolvers/zod';
import { message } from 'antd';
import md5 from 'md5-es';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { login } from '@/apis/auth';
import { PasswordInput } from '@/components/password-input';
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

import useRedirect from '../../hooks/useRedirect';

// 表单验证规则
const loginSchema = z.object({
	username: z.string().min(1, '请输入用户名'),
	password: z.string().min(6, '密码至少6位字符')
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface ILoginProps {
	finishSignIn: () => void;
	retrievePassword: () => void;
}

const Login: React.FC<ILoginProps> = ({ finishSignIn, retrievePassword }) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const { redirect } = useRedirect();
	// 获取重定向目标路径

	// 初始化表单
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: '',
			password: ''
		}
	});

	// 提交处理
	const onSubmit = async (values: LoginFormValues) => {
		setIsLoading(true);

		try {
			const { accessToken } = await login({
				username: values.username,
				password: md5.hash(values.password)
			});

			if (accessToken) {
				localStorage.setItem(LocalStorageKey.AccessToken, accessToken);

				message.success('登录成功，页面即将刷新');

				setTimeout(() => {
					// 使用获取的重定向路径
					redirect();
				}, 1000);
			}

			finishSignIn();
		} catch (err) {
			message.error('登录失败，请检查用户名和密码');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-bold">用户登录</CardTitle>
					<CardDescription>请输入您的用户名和密码进行登录</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* 用户名输入框 */}
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-medium">用户名</FormLabel>
										<FormControl>
											<Input
												placeholder="请输入用户名"
												{...field}
												disabled={isLoading}
												className="h-11 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* 密码输入框 */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-medium">密码</FormLabel>
										<FormControl>
											<PasswordInput
												placeholder="请输入密码"
												{...field}
												disabled={isLoading}
												className="h-11 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* 按钮组 */}
							<div className="flex flex-col space-y-3">
								<Button
									type="submit"
									className="h-11 w-full bg-blue-600 hover:bg-blue-700 transition-colors"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
											登录中...
										</>
									) : (
										'登录'
									)}
								</Button>

								<div className="flex justify-between gap-3">
									<Button
										type="button"
										variant="outline"
										onClick={retrievePassword}
										disabled={isLoading}
										className="h-10 text-sm text-gray-600 hover:text-gray-800 transition-colors basis-[180px] grow"
									>
										忘记密码？
									</Button>

									<Button
										type="button"
										variant="outline"
										onClick={() => {
											window.location.href = '/account/register';
										}}
										disabled={isLoading}
										className="h-10 text-sm text-gray-600 hover:text-gray-800 transition-colors basis-[180px] grow"
									>
										注册账号
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Login;
