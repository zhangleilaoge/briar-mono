// components/ImageActions.tsx
import { IMaterial } from 'briar-shared';
import { Copy, Download, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ImageActionsProps {
	image: IMaterial;
	viewMode: 'grid' | 'list';
	deletingId: number | null;
	onCopy: (url: string) => void;
	onDownload: (image: IMaterial) => void;
	onDelete: (image: IMaterial) => void;
}

function ImageActions({
	image,
	viewMode,
	deletingId,
	onCopy,
	onDownload,
	onDelete
}: ImageActionsProps) {
	return (
		<div className="flex space-x-2 w-full">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="flex-1"
							disabled={deletingId === image.id}
							onClick={() => onCopy(image.url || '')}
						>
							<Copy className="w-3 h-3 mr-1" />
							{viewMode === 'list' ? '' : '复制'}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>复制图片链接</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							disabled={deletingId === image.id}
							variant="outline"
							size="sm"
							onClick={() => onDownload(image)}
						>
							<Download className="w-3 h-3" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>下载图片</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => onDelete(image)}
							disabled={deletingId === image.id}
						>
							<Trash2 className="w-3 h-3" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>删除图片</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}

export default ImageActions;
