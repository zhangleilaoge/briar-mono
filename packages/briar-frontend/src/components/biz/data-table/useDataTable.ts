'use client';

import { useRequest } from 'ahooks';
import { useCallback, useState } from 'react';

export function useDataTable<T>({
	initialSort = { field: 'id', direction: 'asc' },
	initialPagination = { page: 1, pageSize: 10 },
	fetchData,
	updateKey
}: {
	initialSort?: { field: string; direction: 'asc' | 'desc' };
	initialPagination?: { page: number; pageSize: number };
	fetchData: (params: {
		sort: { field: string; direction: 'asc' | 'desc' };
		pagination: { page: number; pageSize: number };
	}) => Promise<{ data: T[]; total: number }>;
	updateKey?: string;
}) {
	const [sortConfig, setSortConfig] = useState(initialSort);
	const [pagination, setPagination] = useState(initialPagination);
	const { data, run: loadData } = useRequest(
		({ _sortConfig = sortConfig, _pagination = pagination } = {}) => {
			setIsLoading(true);
			console.log(_sortConfig, _pagination);
			return fetchData({
				sort: _sortConfig,
				pagination: _pagination
			}).finally(() => setIsLoading(false));
		},
		{
			refreshDeps: [sortConfig, pagination, updateKey]
		}
	);
	const [isLoading, setIsLoading] = useState(false);

	const refresh = useCallback(() => {
		setSortConfig(initialSort);
		setPagination(initialPagination);
	}, [initialSort, initialPagination]);

	const handleSortChange = (
		newSort: { field: string; direction: 'asc' | 'desc' } = initialSort
	) => {
		setSortConfig(newSort);
		setPagination((prev) => ({ ...prev, page: 1 })); // 排序时重置到第一页
	};

	const handlePageChange = (newPage: number) => {
		setPagination((prev) => ({ ...prev, page: newPage }));
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPagination((prev) => ({ ...prev, page: 1, pageSize: newPageSize })); // 切换页大小时重置到第一页
	};

	return {
		data,
		sortConfig,
		pagination,
		isLoading,
		loadData,
		refresh,
		onSortChange: handleSortChange,
		onPageChange: handlePageChange,
		onPageSizeChange: handlePageSizeChange
	};
}
