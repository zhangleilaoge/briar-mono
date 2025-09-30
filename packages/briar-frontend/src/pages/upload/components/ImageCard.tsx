// components/ImageCard.tsx
import { IMaterial } from 'briar-shared';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

import ImageActions from './ImageActions';
import ImageInfo from './ImageInfo';
import ImagePreview from './ImagePreview';

interface ImageCardProps {
	image: IMaterial;
	viewMode: 'grid' | 'list';
	deletingId: number | null;
	onCopy: (url: string) => void;
	onDownload: (image: IMaterial) => void;
	onDelete: (image: IMaterial) => void;
	getFileTypeIcon: (type?: string) => string;
	className?: string;
}

export function ImageCard({
	image,
	viewMode,
	deletingId,
	onCopy,
	onDownload,
	onDelete,
	getFileTypeIcon,

	className
}: ImageCardProps) {
	return (
		<Card
			className={`
                ${className}
        overflow-hidden hover:shadow-lg transition-all duration-200 h-fit
        ${viewMode === 'list' ? 'flex items-center justify-between p-4' : ''}
        ${deletingId === image.id ? 'opacity-50' : ''}
      `}
		>
			<CardContent
				className={
					viewMode === 'list' ? 'p-0 flex items-center gap-4 max-w-[calc(100%-200px)]' : 'p-0'
				}
			>
				{/* 图片预览区域 */}
				<ImagePreview image={image} viewMode={viewMode} />

				{/* 图片信息 */}
				<ImageInfo image={image} getFileTypeIcon={getFileTypeIcon} viewMode={viewMode} />
			</CardContent>

			{/* 操作按钮 */}
			<CardFooter className={viewMode === 'list' ? 'p-0' : 'p-3 pt-0'}>
				<ImageActions
					image={image}
					viewMode={viewMode}
					deletingId={deletingId}
					onCopy={onCopy}
					onDownload={onDownload}
					onDelete={onDelete}
				/>
			</CardFooter>
		</Card>
	);
}
