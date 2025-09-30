import { message } from 'antd';
import { IMaterial, IPageInfo } from 'briar-shared';
import { useCallback, useEffect, useState } from 'react';

import { getImgMaterials } from '../../api';

const PAGE_SIZE = 20;

export function useImageMaterials(initialPage: IPageInfo = { page: 1, pageSize: PAGE_SIZE }) {
	const [materials, setMaterials] = useState<IMaterial[]>([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState<IPageInfo>(initialPage);
	const [total, setTotal] = useState(0);
	const [searchTerm, setSearchTerm] = useState(''); // 搜索输入框的值
	const [activeSearchTerm, setActiveSearchTerm] = useState(''); // 实际用于搜索的值

	const fetchMaterials = useCallback(async () => {
		try {
			setLoading(true);
			const response = await getImgMaterials({
				pagination: {
					page: pagination.page,
					pageSize: pagination.pageSize
				},
				searchTerm: activeSearchTerm // 使用activeSearchTerm而不是searchTerm
			});

			setMaterials(response.items || []);
			setTotal(response.paginator?.total || 0);

			setPagination((prev) => ({
				...prev,
				total: response.paginator?.total || 0
			}));
		} catch (err) {
			message.error('加载图片失败');
		} finally {
			setLoading(false);
		}
	}, [pagination.page, pagination.pageSize, activeSearchTerm]); // 依赖activeSearchTerm

	useEffect(() => {
		fetchMaterials();
	}, [fetchMaterials]);

	// 执行搜索
	const handleSearch = useCallback(() => {
		setActiveSearchTerm(searchTerm); // 将输入框的值设置为实际搜索值
		setPagination((prev) => ({ ...prev, page: 1 })); // 搜索时重置到第一页
	}, [searchTerm]);

	// 清空搜索
	const handleClearSearch = useCallback(() => {
		setSearchTerm('');
		setActiveSearchTerm('');
		setPagination((prev) => ({ ...prev, page: 1 }));
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setPagination((prev) => ({ ...prev, page }));
	}, []);

	const handlePageSizeChange = useCallback((pageSize: number) => {
		setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
	}, []);

	return {
		materials,
		loading,
		pagination,
		total,
		searchTerm,
		activeSearchTerm,
		setSearchTerm, // 暴露设置搜索词的方法
		setPagination,
		handlePageChange,
		handlePageSizeChange,
		handleSearch, // 执行搜索
		handleClearSearch, // 清空搜索
		refetch: fetchMaterials
	};
}
