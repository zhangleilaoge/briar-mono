import { message, Pagination } from 'antd';
import { IMaterial } from 'briar-shared';
import { Grid3X3, List, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Masonry } from 'react-masonry-component2';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { deleteImgs } from '../../api';
import { ImageCard } from '../ImageCard';
import { useImageMaterials } from './useImageMaterials';

interface ImageGalleryProps {}

const PAGE_SIZE = 20;

export function ImageGallery({}: ImageGalleryProps) {
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [deletingId, setDeletingId] = useState<number | null>(null);

	// 使用修改后的Hook
	const {
		materials,
		loading,
		total,
		refetch,
		pagination,
		handlePageChange,
		handleSearch,
		handleClearSearch,
		searchTerm,
		setSearchTerm,
		activeSearchTerm
	} = useImageMaterials();

	// 处理输入框变
	const handleSearchChange = useCallback(
		(term: string) => {
			setSearchTerm(term); // 只更新输入框的值，不触发搜索
		},
		[setSearchTerm]
	);

	// 处理回车键搜索
	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				handleSearch(); // 回车触发搜索
			}
		},
		[handleSearch]
	);

	// 其他函数保持不变...
	const copyToClipboard = (url: string) => {
		navigator.clipboard.writeText(url);
		message.success('复制成功');
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

	const handleDelete = useCallback(
		async (image: IMaterial) => {
			try {
				setDeletingId(image.id);
				await deleteImgs([image]);
				await refetch();
				message.success('删除成功');
			} catch (err) {
				message.error('删除失败' + err);
				refetch();
			} finally {
				setDeletingId(null);
			}
		},
		[refetch]
	);

	// if (loading) {
	// 	return <div className="flex justify-center items-center py-8">加载中...</div>;
	// }

	const renderList = useMemo(() => {
		return (
			<>
				{materials.length > 0 &&
					(viewMode === 'grid' ? (
						<Masonry
							direction="column"
							sortWithHeight
							columnsCountBreakPoints={{
								1400: 5,
								1000: 4,
								700: 3
							}}
						>
							{materials.map((image) => (
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
							{materials.map((image) => (
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
				{/* 图片网格/列表 */}
				{materials.length === 0 && (
					<div className="text-center py-12 text-gray-500">
						{activeSearchTerm ? '没有找到匹配的图片' : '暂无图片'}
					</div>
				)}
				{/* 分页组件 */}
				<Pagination
					current={pagination.page}
					onChange={handlePageChange}
					total={total}
					pageSize={PAGE_SIZE}
					showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
				/>
			</>
		);
	}, [
		activeSearchTerm,
		deletingId,
		handleDelete,
		handlePageChange,
		materials,
		pagination.page,
		total,
		viewMode
	]);

	return (
		<div className="space-y-4">
			{/* 搜索和筛选栏 */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<div className="relative flex-1 sm:flex-initial sm:w-80">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							placeholder="搜索图片名称或标签..."
							value={searchTerm}
							onChange={(e) => handleSearchChange(e.target.value)}
							onKeyPress={handleKeyPress} // 添加回车键监听
							className="pl-10 pr-20" // 为按钮留出空间
						/>
						{/* 搜索按钮 */}
						<Button
							size="sm"
							type="submit"
							onClick={handleSearch}
							className="bg-blue-600 hover:bg-blue-700 absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-3"
						>
							<Search />
						</Button>
					</div>

					{/* 清空按钮 */}
					{activeSearchTerm && (
						<Button variant="outline" size="sm" onClick={handleClearSearch}>
							清空
						</Button>
					)}
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
				<span>共找到 {total} 张图片</span>
				{activeSearchTerm && <span>搜索关键词: &quot;{activeSearchTerm}&quot;</span>}
			</div>

			{loading ? (
				<div className="flex justify-center items-center py-8">加载中...</div>
			) : (
				renderList
			)}
		</div>
	);
}

export default ImageGallery;
