'use client';

import { SelectTrigger } from '@radix-ui/react-select';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';

export function Pagination({
	current,
	pageSize,
	total,
	onChange,
	onPageSizeChange,
	disabled
}: {
	current: number;
	pageSize: number;
	total: number;
	onChange: (page: number) => void;
	onPageSizeChange?: (pageSize: number) => void;
	disabled?: boolean;
}) {
	const totalPages = Math.ceil(total / pageSize);

	// 生成页码按钮（当前页前后各显示2页）
	const getPageNumbers = () => {
		const pages = [];
		const startPage = Math.max(1, current - 2);
		const endPage = Math.min(totalPages, current + 2);

		// 总是显示第一页
		if (startPage > 1) {
			pages.push(1);
			if (startPage > 2) {
				pages.push('...');
			}
		}

		// 当前页附近的页码
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		// 总是显示最后一页
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pages.push('...');
			}
			pages.push(totalPages);
		}

		return pages;
	};

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center space-x-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onChange(Math.max(1, current - 1))}
					disabled={current <= 1 || disabled}
					className="h-8 w-8"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				<div className="flex items-center space-x-1">
					{getPageNumbers().map((page, index) =>
						page === '...' ? (
							<Button
								key={`ellipsis-${index}`}
								variant="ghost"
								size="icon"
								className="h-8 w-8 cursor-default"
								disabled
							>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						) : (
							<Button
								key={page}
								variant={page === current ? 'outline' : 'ghost'}
								size="icon"
								onClick={() => onChange(page as number)}
								disabled={disabled}
								className="h-8 w-8"
							>
								{page}
							</Button>
						)
					)}
				</div>

				<Button
					variant="ghost"
					size="icon"
					onClick={() => onChange(Math.min(totalPages, current + 1))}
					disabled={current >= totalPages || disabled}
					className="h-8 w-8"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
			{onPageSizeChange && (
				<div className="flex items-center space-x-2">
					<Select
						value={pageSize.toString()}
						onValueChange={(value) => onPageSizeChange(Number(value))}
						disabled={disabled}
					>
						<SelectTrigger className="w-[88px]">
							<Input value={`${pageSize} 条 / 页`} readOnly />
						</SelectTrigger>
						<SelectContent position="popper">
							{[10, 20, 30, 40, 50].map((size) => (
								<SelectItem key={size} value={size.toString()}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}
		</div>
	);
}
