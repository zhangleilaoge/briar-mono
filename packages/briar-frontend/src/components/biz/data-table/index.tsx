'use client';

import { Spin } from 'antd';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
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
	/* ===== 多选相关 ===== */
	rowKey?: (row: T) => React.Key; // 不传默认用数组 index
	batchActions?: {
		// 顶部批量操作按钮组
		label: ReactNode;
		onClick: (selectedRows: T[]) => void;
		danger?: boolean; // 红色警示按钮
	}[];
};
export function DataTable<T>({
	data,
	columns,
	total = 0,
	pagination = { page: 1, pageSize: 10 },
	isLoading = false,
	onSortChange,
	onPageChange = () => {},
	onPageSizeChange,
	batchActions = [],
	rowKey
}: DataTableProps<T>) {
	const [sortConfig, setSortConfig] = useState<{
		field: string;
		direction: 'asc' | 'desc';
	}>({ field: 'id', direction: 'asc' });
	/* 多选核心状态 */
	const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]); // 只存 key 数组，跨页记忆
	/* 当前页对应的 key 集合 */
	const pageKeys = useMemo(() => data.map((r, i) => (rowKey ? rowKey(r) : i)), [data, rowKey]);

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

	/* 当前页是否全选 */
	const isPageAllSelected = pageKeys.length > 0 && pageKeys.every((k) => selectedKeys.includes(k));

	/* 批量操作栏：是否展示 */
	const showBatchBar = selectedKeys.length > 0;

	/* 勾选/取消单行 */
	const toggleRow = (key: React.Key) =>
		setSelectedKeys((prev) =>
			prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
		);

	/* 勾选/取消当前页全部 */
	const togglePageAll = () =>
		setSelectedKeys((prev) => {
			const restKeys = prev.filter((k) => !pageKeys.includes(k)); // 其它页的
			if (isPageAllSelected) return restKeys; // 取消当前页
			return Array.from(new Set([...restKeys, ...pageKeys])); // 合并当前页
		});

	/* 把 key 还原成行数据，抛给业务层 */
	const selectedRows = useMemo(
		() =>
			data.filter((r, i) => {
				const k = rowKey ? rowKey(r) : i;
				return selectedKeys.includes(k);
			}),
		[data, selectedKeys, rowKey]
	);

	useEffect(() => {
		setSelectedKeys([]);
	}, [pagination.page]);

	return (
		<div className="space-y-4">
			{/* 表格本体 */}
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
								{/* 多选列 */}
								<TableHead className="w-10">
									<Checkbox
										checked={isPageAllSelected}
										onClick={togglePageAll}
										aria-label="全选当前页"
									/>
								</TableHead>

								{columns.map((col) => (
									<TableHead key={col.key}>
										{col.sortable ? (
											<Button
												variant="ghost"
												onClick={() => handleSort(col.key)}
												className="p-0 hover:bg-transparent flex items-center"
											>
												<span>{col.header}</span>
												<SortIndicator
													active={sortConfig.field === col.key}
													direction={sortConfig.direction}
												/>
											</Button>
										) : (
											col.header
										)}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>

						<TableBody>
							{data.length ? (
								data.map((row, i) => {
									const key = rowKey ? rowKey(row) : i;
									return (
										<TableRow key={key}>
											{/* 行 checkbox */}
											<TableCell>
												<Checkbox
													checked={selectedKeys.includes(key)}
													onClick={() => toggleRow(key)}
													aria-label="选择行"
												/>
											</TableCell>

											{columns.map((col) => (
												<TableCell key={col.key}>
													{col.cell ? col.cell(row) : (row as any)[col.key]}
												</TableCell>
											))}
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell colSpan={columns.length + 1} className="text-center py-4">
										No data available
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</Spin>
			</div>

			<div className="flex items-center justify-between flex-row-reverse">
				{/* 分页 */}
				<Pagination
					current={pagination.page}
					pageSize={pagination.pageSize}
					total={total}
					onChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
					disabled={isLoading}
				/>

				{/* 顶部批量操作栏 */}
				{showBatchBar && (
					<div className="flex items-center justify-between rounded-md gap-2">
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">已选 {selectedKeys.length} 项</span>
						</div>
						<div className="flex items-center gap-2">
							{batchActions.map((action) => (
								<Button
									key={action.label?.toString()}
									size="sm"
									variant={action.danger ? 'destructive' : 'default'}
									onClick={() => action.onClick(selectedRows)}
								>
									{action.label}
								</Button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
