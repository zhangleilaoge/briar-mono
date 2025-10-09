// components/ImagePreview.tsx
import { Image, Spin } from 'antd';
import { IMaterial } from 'briar-shared';
import cx from 'classnames';
import { useState } from 'react';

interface ImagePreviewProps {
	image: IMaterial;
	viewMode: 'grid' | 'list';
}

function ImagePreview({ image, viewMode }: ImagePreviewProps) {
	const [isLoading, setIsLoading] = useState(true);

	const handleImageLoad = () => {
		setIsLoading(false);
	};

	return (
		<div
			className={`
      relative group cursor-pointer
      ${viewMode === 'list' ? 'overflow-hidden aspect-square' : ''}
    `}
		>
			<Spin spinning={isLoading} className="flex items-center justify-center size-full">
				<Image
					preview={{ src: image.url }}
					src={image.url + '?imageMogr2/quality/30'}
					alt={image.name}
					className={cx(viewMode === 'list' ? '!w-[100px] !h-[100px]' : '', 'object-cover')}
					onLoad={handleImageLoad}
				/>
			</Spin>
		</div>
	);
}

export default ImagePreview;
