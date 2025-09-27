'use client';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const incomeSchema = z
	.object({
		// 这里的错误，挂载 form.income.all 上，因此 name="income" 的 field 是不会展示这里的错误的
		all: z.number().nonnegative().optional(),
		salary: z.number().nonnegative().optional(),
		other: z.number().nonnegative().optional()
	})
	.superRefine((val, ctx) => {
		/* ===== 这里是子表单自己的全部 refine ===== */
		const needDetail = val.salary !== undefined || val.other !== undefined;

		if (val.all === 0) {
			ctx.addIssue({
				code: 'custom',
				message: '总收入必须大于0'
			});
			return;
		}

		if (val.all === undefined && !needDetail) {
			ctx.addIssue({
				code: 'custom',
				message: '必须填写总收入或分项收入'
			});
			return;
		}

		if (
			val.all !== undefined &&
			val.salary !== undefined &&
			val.other !== undefined &&
			val.all !== val.salary + val.other
		) {
			ctx.addIssue({
				code: 'custom',
				message: '总收入必须等于工资收入加其他收入'
			});
		}
	});

export type IncomeValues = z.infer<typeof incomeSchema>;

interface Props {}

export function IncomeField({}: Props) {
	const { watch, setValue } = useFormContext(); // 多解构一个 setValue
	const job = watch('job'); // 直接监听job字段

	// 工具函数：计算并回填 all
	const recalcAll = () => {
		if (job !== 'civil') return;
		const salary = watch('income.salary') ?? 0;
		const other = watch('income.other') ?? 0;
		setValue('income.all', salary + other, { shouldValidate: false }); // 不触发校验，避免死循环
	};

	return (
		<FormItem>
			<FormLabel>{job === 'civil' ? '收入明细（万元）' : '年总收入（万元）'}</FormLabel>
			<FormControl>
				<div className="space-y-3">
					{job !== 'civil' ? (
						<FormField
							name="income.all"
							render={({ field }) => (
								<>
									<Input type="number" placeholder="请输入年总收入" {...field} />
									<FormMessage /> {/* 此处会显示验证错误信息 */}
								</>
							)}
						/>
					) : (
						<div className="flex gap-3 items-center">
							<span>工资收入</span>

							<FormField
								name="income.salary"
								render={({ field }) => (
									<div className="flex-1">
										<Input
											type="number"
											placeholder="工资收入"
											{...field}
											onChange={(e) => {
												field.onChange(e.target.valueAsNumber);
												recalcAll();
											}}
										/>
										<FormMessage /> {/* 此处会显示验证错误信息 */}
									</div>
								)}
							/>
							<span>其他收入</span>

							<FormField
								name="income.other"
								render={({ field }) => (
									<div className="flex-1">
										<Input
											type="number"
											placeholder="其他收入"
											{...field}
											onChange={(e) => {
												field.onChange(e.target.valueAsNumber);
												recalcAll();
											}}
										/>
										<FormMessage /> {/* 此处会显示验证错误信息 */}
									</div>
								)}
							/>
						</div>
					)}
				</div>
			</FormControl>
			<FormMessage />
		</FormItem>
	);
}
