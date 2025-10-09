'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { DbName } from '@/pages/index-db/db/types/common';

export function useDataTable<T>({
	initialSort = { field: 'id', direction: 'asc' },
	initialPagination = { page: 1, pageSize: 10 },
	fetchData,
	entityName
}: {
	initialSort?: { field: string; direction: 'asc' | 'desc' };
	initialPagination?: { page: number; pageSize: number };
	fetchData: (params: {
		sort: { field: string; direction: 'asc' | 'desc' };
		pagination: { page: number; pageSize: number };
	}) => Promise<{ data: T[]; total: number }>;
	entityName: DbName;
}) {
	const [data, setData] = useState<T[]>([]);
	const [total, setTotal] = useState(0);
	const [sortConfig, setSortConfig] = useState(initialSort);
	const [pagination, setPagination] = useState(initialPagination);
	const [isLoading, setIsLoading] = useState(false);
	const lastQueryRef = useRef('');

	// 使用 useCallback 缓存加载函数
	const loadData = useCallback(
		async (force: boolean = false) => {
			const currentQuery = JSON.stringify({ sortConfig, pagination, entityName });

			// 如果查询参数没有变化，则跳过加载
			if (lastQueryRef.current === currentQuery && !force) return;
			lastQueryRef.current = currentQuery;

			setIsLoading(true);
			try {
				const result = await fetchData({
					sort: sortConfig,
					pagination
				});
				setData(result.data);
				setTotal(result.total);
			} finally {
				setIsLoading(false);
			}
		},
		[sortConfig, pagination, entityName]
	);

	const refresh = useCallback(() => {
		loadData(true);
	}, [loadData]);

	const handleSortChange = (newSort: { field: string; direction: 'asc' | 'desc' }) => {
		setSortConfig(newSort);
		setPagination((prev) => ({ ...prev, page: 1 })); // 排序时重置到第一页
	};

	const handlePageChange = (newPage: number) => {
		setPagination((prev) => ({ ...prev, page: newPage }));
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPagination((prev) => ({ ...prev, page: 1, pageSize: newPageSize })); // 切换页大小时重置到第一页
	};

	// 添加 useEffect 自动响应状态变化
	useEffect(() => {
		loadData();
	}, [loadData]);

	return {
		data,
		total,
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
