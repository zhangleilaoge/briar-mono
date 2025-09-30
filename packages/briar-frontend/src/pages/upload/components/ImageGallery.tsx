import { message, Pagination } from 'antd';
import { IMaterial, IPageInfo } from 'briar-shared';
import { Grid3X3, List, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Masonry } from 'react-masonry-component2';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { deleteImgs, getImgMaterials } from '../api';
import { ImageCard } from './ImageCard';

interface ImageGalleryProps {}

const PAGE_SIZE = 20;

// 修改 useImageMaterials Hook
export function useImageMaterials(initialPage: IPageInfo = { page: 1, pageSize: PAGE_SIZE }) {
	const [materials, setMaterials] = useState<IMaterial[]>([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState<IPageInfo>(initialPage);
	const [total, setTotal] = useState(0);

	const fetchMaterials = useCallback(async () => {
		try {
			setLoading(true);
			const response = await getImgMaterials({
				pagination: {
					page: pagination.page,
					pageSize: pagination.pageSize
				}
			});

			setMaterials(response.items || []);
			setTotal(response.paginator?.total || 0);

			// 更新分页信息
			setPagination((prev) => ({
				...prev,
				total: response.paginator?.total || 0
			}));
		} catch (err) {
			message.error('加载图片失败');
		} finally {
			setLoading(false);
		}
	}, [pagination.page, pagination.pageSize]);

	useEffect(() => {
		fetchMaterials();
	}, [fetchMaterials]);

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
		setPagination,
		handlePageChange,
		handlePageSizeChange,
		refetch: fetchMaterials
	};
}

export function ImageGallery({}: ImageGalleryProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const { materials, loading, refetch, pagination, handlePageChange } = useImageMaterials();

	// 过滤和排序图片
	const filteredAndSortedImages = useMemo(() => {
		const result = materials.filter((image) =>
			image.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

		return result;
	}, [materials, searchTerm]);

	const copyToClipboard = (url: string) => {
		navigator.clipboard.writeText(url);
		message.success('复制成功');
		// 可以添加Toast提示
	};

	const downloadImage = (image: IMaterial) => {
		const link = document.createElement('a');
		link.href = image.url!;
		link.download = image.name;
		link.click();
	};

	const getFileTypeIcon = (type?: string) => {
		if (!type) return '📷';
		if (type.includes('png')) return '🖼️';
		if (type.includes('jpeg') || type.includes('jpg')) return '🌄';
		if (type.includes('gif')) return '🎬';
		return '📷';
	};

	// 图片删除功能
	const handleDelete = useCallback(
		async (image: IMaterial) => {
			try {
				setDeletingId(image.id);
				// 调用删除API
				await deleteImgs([image]);

				// 乐观更新：立即从本地状态中移除
				await refetch();

				// 可以添加成功提示
				message.success('删除成功');
			} catch (err) {
				message.error('删除失败' + err);
				// 可以添加错误提示，并重新获取数据确保状态同步
				refetch();
			} finally {
				setDeletingId(null);
			}
		},
		[refetch]
	);

	if (loading) {
		return <div className="flex justify-center items-center py-8">加载中...</div>;
	}

	return (
		<div className="space-y-4">
			{/* 搜索和筛选栏 */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<div className="relative flex-1 sm:flex-initial sm:w-64">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							placeholder="搜索图片名称或标签..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant={viewMode === 'grid' ? 'default' : 'outline'}
						size="sm"
						onClick={() => setViewMode('grid')}
					>
						<Grid3X3 className="w-4 h-4" />
					</Button>
					<Button
						variant={viewMode === 'list' ? 'default' : 'outline'}
						size="sm"
						onClick={() => setViewMode('list')}
					>
						<List className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* 图片统计 */}
			<div className="flex items-center justify-between text-sm text-gray-600">
				<span>共找到 {filteredAndSortedImages.length} 张图片</span>
				{searchTerm && <span>搜索关键词: &quot;{searchTerm}&quot;</span>}
			</div>

			{/* 图片网格/列表 */}
			{filteredAndSortedImages.length === 0 && (
				<div className="text-center py-12 text-gray-500">
					{searchTerm ? '没有找到匹配的图片' : '暂无图片'}
				</div>
			)}

			{filteredAndSortedImages.length > 0 &&
				(viewMode === 'grid' ? (
					<Masonry
						direction="column" // 纵向瀑布流
						sortWithHeight // 按高度排序，避免某一列过长
						columnsCountBreakPoints={{
							// 响应式列数
							1400: 5,
							1000: 4,
							700: 3
						}}
					>
						{filteredAndSortedImages.map((image) => (
							<ImageCard
								className="mb-5"
								key={image.id}
								image={image}
								viewMode={viewMode}
								deletingId={deletingId}
								onCopy={copyToClipboard}
								onDownload={downloadImage}
								onDelete={handleDelete}
								getFileTypeIcon={getFileTypeIcon}
							/>
						))}
					</Masonry>
				) : (
					<div className={'space-y-4'}>
						{filteredAndSortedImages.map((image) => (
							<ImageCard
								key={image.id}
								image={image}
								viewMode={viewMode}
								deletingId={deletingId}
								onCopy={copyToClipboard}
								onDownload={downloadImage}
								onDelete={handleDelete}
								getFileTypeIcon={getFileTypeIcon}
							/>
						))}
					</div>
				))}

			{/* 分页组件 */}
			<Pagination
				current={pagination.page}
				onChange={handlePageChange}
				total={pagination.total}
				pageSize={PAGE_SIZE}
			/>
		</div>
	);
}
