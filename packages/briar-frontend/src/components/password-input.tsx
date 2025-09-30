// components/ui/password-input.tsx
'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const PasswordInput = forwardRef<HTMLInputElement, any>(({ className, ...props }, ref) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="relative">
			<Input
				type={showPassword ? 'text' : 'password'}
				className={cn('pr-10', className)}
				ref={ref}
				{...props}
			/>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
				onClick={() => setShowPassword((prev) => !prev)}
			>
				{showPassword ? (
					<EyeOffIcon className="h-4 w-4" aria-hidden="true" />
				) : (
					<EyeIcon className="h-4 w-4" aria-hidden="true" />
				)}
				<span className="sr-only">{showPassword ? '隐藏密码' : '显示密码'}</span>
			</Button>

			{/* 隐藏浏览器默认的密码显示控件 */}
			{/* <style jsx>{`
				.hide-password-toggle::-ms-reveal,
				.hide-password-toggle::-ms-clear {
					visibility: hidden;
					pointer-events: none;
					display: none;
				}
			`}</style> */}
		</div>
	);
});

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
