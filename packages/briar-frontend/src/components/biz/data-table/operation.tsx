'use client';

import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type ConfirmType = 'dialog' | 'popover';

type OperationConfig<T> = {
	title: string;
	icon?: LucideIcon;
	variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	size?: 'default' | 'sm' | 'lg' | 'icon';
	onClick: (data: T) => void | Promise<void>;
	confirm?: {
		title: string;
		description: string;
		confirmText?: string;
		cancelText?: string;
		type?: ConfirmType; // 新增：支持选择确认类型
	};
	disabled?: boolean | ((data: T) => boolean);
	className?: string;
};

type OperationProps<T> = {
	data: T;
	config: OperationConfig<T>[];
	className?: string;
};

export function Operation<T>({ data, config, className = '' }: OperationProps<T>) {
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		config: OperationConfig<T> | null;
	}>({ open: false, config: null });

	const [popoverOpen, setPopoverOpen] = useState<{
		open: boolean;
		config: OperationConfig<T> | null;
	}>({ open: false, config: null });

	const handleClick = async (item: OperationConfig<T>) => {
		if (item.confirm) {
			if (item.confirm.type === 'popover') {
				setPopoverOpen({ open: true, config: item });
			} else {
				setConfirmDialog({ open: true, config: item });
			}
		} else {
			await item.onClick(data);
		}
	};

	const handleConfirm = async () => {
		if (confirmDialog.config) {
			await confirmDialog.config.onClick(data);
		}
		if (popoverOpen.config) {
			await popoverOpen.config.onClick(data);
		}

		setConfirmDialog({ open: false, config: null });
		setPopoverOpen({ open: false, config: null });
	};

	const handleCancel = () => {
		setConfirmDialog({ open: false, config: null });
		setPopoverOpen({ open: false, config: null });
	};

	const isDisabled = (item: OperationConfig<T>) => {
		if (typeof item.disabled === 'function') {
			return item.disabled(data);
		}
		return item.disabled || false;
	};

	return (
		<>
			<div className={`flex gap-2 ${className}`}>
				{config.map((item, index) => {
					const IconComponent = item.icon;
					const disabled = isDisabled(item);
					const btnClassName = `${item.className} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`;
					const aClassName = `${disabled ? '' : 'text-blue-500'}`;

					// 如果是popover确认类型，使用Popover包裹
					if (item.confirm?.type === 'popover') {
						return (
							<Popover key={index} open={popoverOpen.open && popoverOpen.config === item}>
								<PopoverTrigger asChild>
									<Button
										variant={item.variant || 'ghost'}
										size={item.size || 'sm'}
										onClick={() => !disabled && handleClick(item)}
										className={btnClassName}
										disabled={disabled}
									>
										{IconComponent && <IconComponent className="h-4 w-4 mr-1" />}
										<a className={aClassName}>{item.title}</a>
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-80">
									<div className="space-y-4">
										<h4 className="font-medium leading-none">{item.confirm.title}</h4>
										<p className="text-sm text-muted-foreground">{item.confirm.description}</p>
										<div className="flex justify-end gap-2">
											<Button variant="outline" size="sm" onClick={handleCancel}>
												{item.confirm.cancelText || 'Cancel'}
											</Button>
											<Button variant="default" size="sm" onClick={handleConfirm}>
												{item.confirm.confirmText || 'Confirm'}
											</Button>
										</div>
									</div>
								</PopoverContent>
							</Popover>
						);
					}

					// 默认情况（无确认或dialog确认）
					return (
						<Button
							key={index}
							variant={item.variant || 'ghost'}
							size={item.size || 'sm'}
							onClick={() => !disabled && handleClick(item)}
							className={btnClassName}
							disabled={disabled}
						>
							{IconComponent && <IconComponent className="h-4 w-4 mr-1" />}
							<a className={aClassName}>{item.title}</a>
						</Button>
					);
				})}
			</div>

			{/* Dialog确认 */}
			<AlertDialog open={confirmDialog.open} onOpenChange={handleCancel}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{confirmDialog.config?.confirm?.title}</AlertDialogTitle>
						<AlertDialogDescription>
							{confirmDialog.config?.confirm?.description}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCancel}>
							{confirmDialog.config?.confirm?.cancelText || 'Cancel'}
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirm}>
							{confirmDialog.config?.confirm?.confirmText || 'Confirm'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
