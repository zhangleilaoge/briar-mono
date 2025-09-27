'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

import { IncomeField, incomeSchema } from './fields/income';

/* ---------- 1. 动态 schema ---------- */
const formSchema = z
	.object({
		username: z.string().min(2, '用户名至少2个字符').max(50, '用户名不能超过50个字符'),
		email: z.string().email('请输入有效的邮箱地址'),
		password: z
			.string()
			.min(6, '密码至少6个字符')
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, '密码需包含大小写字母和数字'),
		confirmPassword: z.string(),
		age: z
			.number({ invalid_type_error: '请输入数字' })
			.min(18, '年龄必须满18岁')
			.max(120, '请输入合理的年龄'),

		/* ===== 新增字段 ===== */
		gender: z.enum(['male', 'female'], { required_error: '请选择性别' }),
		job: z.enum(['civil', 'it', 'education', 'other'], {
			required_error: '请选择职业'
		}),

		/* ===== 重构收入字段 ===== */
		// 统一收入结构
		income: incomeSchema
	})
	.refine((d) => d.password === d.confirmPassword, {
		message: '密码不一致',
		path: ['confirmPassword']
	});

type FormValues = z.infer<typeof formSchema>;

/* ---------- 组件 ---------- */
export default function RegisterForm() {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
			age: undefined,
			gender: undefined,
			job: undefined,
			income: {
				all: 0,
				salary: 0,
				other: 0
			}
		},
		mode: 'onChange'
	});

	// 实时监听
	const gender = useWatch({ control: form.control, name: 'gender' });

	// 提交表单
	function onSubmit(values: FormValues) {
		console.log(values);
		alert(`注册成功！欢迎 ${values.username}`);
	}

	/* ✅ mock 回填 */
	useEffect(() => {
		const timer = setTimeout(() => {
			form.reset({
				username: 'johndoe',
				email: 'john@example.com',
				password: 'Aa123456',
				confirmPassword: 'Aa123456',
				age: 28,
				gender: 'male',
				job: 'civil',
				income: {
					all: 30, // 公务员模式下会被 salary+other 覆盖
					salary: 20,
					other: 10
				}
			});
		}, 1000); // 1 秒后可删除或改成接口返回

		return () => clearTimeout(timer);
	}, [form]);

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

				{/* 性别 */}
				<FormField
					control={form.control}
					name="gender"
					render={({ field }) => (
						<FormItem>
							<FormLabel>性别</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									value={field.value}
									className="flex gap-4"
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="male" id="male" />
										<label htmlFor="male">男</label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="female" id="female" />
										<label htmlFor="female">女</label>
									</div>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* 职业 */}
				<FormField
					control={form.control}
					name="job"
					render={({ field }) => (
						<FormItem>
							<FormLabel>职业</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="请选择职业" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="civil">公务员</SelectItem>
									<SelectItem value="it">IT</SelectItem>
									<SelectItem value="education">教育</SelectItem>
									<SelectItem value="other">其他</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				{gender === 'male' ? (
					<FormField control={form.control} name="income" render={({}) => <IncomeField />} />
				) : null}

				<Button type="submit">提交</Button>
			</form>
		</Form>
	);
}
