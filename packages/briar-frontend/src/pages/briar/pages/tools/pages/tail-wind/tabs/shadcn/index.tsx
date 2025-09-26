'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// 1. 使用 Zod 预定义表单模型（Schema）和验证规则
const formSchema = z
	.object({
		username: z
			.string()
			.min(2, { message: '用户名至少2个字符' })
			.max(50, { message: '用户名不能超过50个字符' }),
		email: z.string().email({ message: '请输入有效的邮箱地址' }),
		password: z
			.string()
			.min(6, { message: '密码至少6个字符' })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
				message: '密码需包含大小写字母和数字'
			}),
		confirmPassword: z.string(),
		age: z
			.number({ invalid_type_error: '请输入数字' })
			.min(18, { message: '年龄必须满18岁' })
			.max(120, { message: '请输入合理的年龄' })
	})
	// 使用 refine 进行跨字段验证（确认密码）
	.refine((data) => data.password === data.confirmPassword, {
		message: '密码不一致',
		path: ['confirmPassword'] // 将错误信息挂到 confirmPassword 字段上
	});

// 2. 推断 Schema 的类型
type FormValues = z.infer<typeof formSchema>;

// 3. 定义表单组件
export default function RegisterForm() {
	// 初始化表单
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema), // 将 Zod schema 与 react-hook-form 集成
		defaultValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
			age: undefined
		},
		mode: 'onChange' // 验证模式设为 onChange，以便用户输入时即时反馈
	});

	// 4. 提交处理函数
	function onSubmit(values: FormValues) {
		console.log(values); // 此处可替换为实际的提交逻辑，如调用 API
		alert(`注册成功！欢迎 ${values.username}`);
	}

	// 5. 渲染表单
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
				{/* 用户名字段 */}
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>用户名</FormLabel>
							<FormControl>
								<Input placeholder="请输入用户名" {...field} />
							</FormControl>
							<FormDescription>这是您将公开显示的名称。</FormDescription>
							<FormMessage /> {/* 此处会显示验证错误信息 */}
						</FormItem>
					)}
				/>

				{/* 邮箱字段 */}
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>邮箱</FormLabel>
							<FormControl>
								<Input type="email" placeholder="请输入邮箱" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* 密码字段 */}
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>密码</FormLabel>
							<FormControl>
								<Input type="password" placeholder="请输入密码" {...field} />
							</FormControl>
							<FormDescription>密码需至少6位，包含大小写字母和数字。</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* 确认密码字段 */}
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>确认密码</FormLabel>
							<FormControl>
								<Input type="password" placeholder="请再次输入密码" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* 年龄字段 */}
				<FormField
					control={form.control}
					name="age"
					render={({ field }) => (
						<FormItem>
							<FormLabel>年龄</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="请输入年龄"
									{...field}
									onChange={(e) => field.onChange(parseInt(e.target.value) || '')} // 将字符串转换为数字
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">提交</Button>
			</form>
		</Form>
	);
}
