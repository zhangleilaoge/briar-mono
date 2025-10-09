'use client';

import { Spin } from 'antd';
import { useState } from 'react';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';

import { Button } from '../../ui/button';
import { Pagination } from './pagenation';

export type ColumnDef<T> = {
	key: string;
	header: string;
	cell?: (row: T) => React.ReactNode;
	sortable?: boolean;
};

export type DataTableProps<T> = {
	data: T[];
	columns: ColumnDef<T>[];
	total?: number;
	pagination?: {
		page: number;
		pageSize: number;
	};
	isLoading?: boolean;
	onSortChange?: (sort: { field: string; direction: 'asc' | 'desc' }) => void;
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (pageSize: number) => void;
};
export function DataTable<T>({
	data,
	columns,
	total = 0,
	pagination = { page: 1, pageSize: 10 },
	isLoading = false,
	onSortChange,
	onPageChange = () => {},
	onPageSizeChange
}: DataTableProps<T>) {
	const [sortConfig, setSortConfig] = useState<{
		field: string;
		direction: 'asc' | 'desc';
	}>({ field: 'id', direction: 'asc' });

	const handleSort = (field: string) => {
		const newSortConfig: { field: string; direction: 'asc' | 'desc' } = {
			field,
			direction: sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc'
		};
		setSortConfig(newSortConfig);
		onSortChange?.(newSortConfig);
	};

	const SortIndicator = ({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) => (
		<span className="inline-flex flex-col ml-2">
			<span
				className={`triangle-up ${active && direction === 'asc' ? 'text-blue-500' : 'text-gray-300'}`}
			/>
			<span
				className={`triangle-down ${active && direction === 'desc' ? 'text-blue-500' : 'text-gray-300'}`}
			/>
		</span>
	);

	return (
		<div className="space-y-4">
			<div className="rounded-md border">
				<style>{`
					.triangle-up,
					.triangle-down {
						display: block;
						width: 0;
						height: 0;
						border-left: 4px solid transparent;
						border-right: 4px solid transparent;
					}
					.triangle-up {
						border-bottom: 4px solid currentColor;
						margin-bottom: 1px;
					}
					.triangle-down {
						border-top: 4px solid currentColor;
						margin-top: 1px;
					}
				`}</style>
				<Spin spinning={isLoading}>
					<Table>
						<TableHeader>
							<TableRow>
								{columns.map((column) => (
									<TableHead key={column.key}>
										{column.sortable ? (
											<Button
												variant="ghost"
												onClick={() => handleSort(column.key)}
												className="p-0 hover:bg-transparent flex items-center"
											>
												<span className="align-middle">{column.header}</span>
												<SortIndicator
													active={sortConfig.field === column.key}
													direction={sortConfig.direction}
												/>
											</Button>
										) : (
											column.header
										)}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>

						<TableBody>
							{data.length > 0 ? (
								data.map((row, index) => (
									<TableRow key={index}>
										{columns.map((column) => (
											<TableCell key={column.key}>
												{column.cell ? column.cell(row) : (row as any)[column.key]}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="text-center py-4">
										No data available
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</Spin>
			</div>
			<Pagination
				current={pagination.page}
				pageSize={pagination.pageSize}
				total={total}
				onChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
				disabled={isLoading}
			/>
		</div>
	);
}
