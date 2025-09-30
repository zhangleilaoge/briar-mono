// components/ImagePreview.tsx
import { Image, Spin } from 'antd';
import { IMaterial } from 'briar-shared';

interface ImagePreviewProps {
	image: IMaterial;
	viewMode: 'grid' | 'list';
}

function ImagePreview({ image, viewMode }: ImagePreviewProps) {
	return (
		<div
			className={`
      relative group cursor-pointer
      ${viewMode === 'list' ? 'w-20 h-20 overflow-hidden' : 'aspect-square'}
    `}
		>
			<Image
				preview={{ src: image.url }}
				src={image.url}
				alt={image.name}
				className="w-full h-full object-cover"
				placeholder={
					<Spin percent="auto" className="h-[60px] w-[60px] flex items-center justify-center" />
				}
			/>
		</div>
	);
}

export default ImagePreview;
