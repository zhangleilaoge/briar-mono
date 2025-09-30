// components/ImageInfo.tsx
import { IMaterial } from 'briar-shared';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ImageInfoProps {
	image: IMaterial;
	getFileTypeIcon: (type?: string) => string;
	viewMode: 'grid' | 'list';
}

function ImageInfo({ image, getFileTypeIcon, viewMode }: ImageInfoProps) {
	return (
		<div className={viewMode === 'list' ? 'flex-1 min-w-0' : 'p-3'}>
			<div className="flex items-start justify-between mb-2">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<p className="text-sm font-medium truncate flex-1 mr-2">
								{getFileTypeIcon(image.type)} {image.name}
							</p>
						</TooltipTrigger>
						<TooltipContent>
							<p>{image.name}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}

export default ImageInfo;
