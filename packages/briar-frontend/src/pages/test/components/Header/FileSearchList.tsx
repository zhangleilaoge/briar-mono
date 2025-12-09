import React, { useEffect, useRef, useState } from 'react';

import { CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

interface FileItem {
	name: string;
	repo: string;
	path: string;
	code?: string;
}

interface FileSearchListProps {
	files: FileItem[];
	showPreview?: boolean;
	inputValue?: string;
}

import FilePreview from './FilePreview';

const FileSearchList: React.FC<FileSearchListProps> = ({
	files,
	showPreview = false,
	inputValue
}) => {
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
	const [activeIdx, setActiveIdx] = useState<number | null>(null);

	useEffect(() => {
		if (!showPreview) return;
		const observer = new MutationObserver(() => {
			const idx = itemRefs.current.findIndex(
				(ref) => ref && ref.getAttribute('data-selected') === 'true'
			);
			if (idx !== -1) {
				setActiveIdx(idx);
			}
		});
		itemRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref, { attributes: true, attributeFilter: ['data-selected'] });
		});
		return () => observer.disconnect();
	}, [files, showPreview]);

	// const containerHeight = 400;

	return (
		<div className="flex flex-col w-full h-[360px]">
			<div className="flex-1 min-h-0">
				<CommandList className="w-full h-full overflow-auto">
					<CommandGroup heading={''}>
						{files.map((file, idx) => (
							<CommandItem key={idx} value={file.name} ref={(el) => (itemRefs.current[idx] = el)}>
								<div className="flex items-center gap-3 w-full">
									{/* 文件icon占位 */}
									<div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
										📄
									</div>
									<div className="flex flex-col flex-1 min-w-0">
										<span className="font-medium text-sm truncate">{file.name}</span>
										<span className="text-xs text-gray-500 truncate">{file.path}</span>
									</div>
									<span className="text-xs px-2 py-0.5 rounded bg-[#e9f1ff] text-[#1a3b75] border border-[#85a9ff]">
										{file.repo}
									</span>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</div>
			{/* 代码预览区域，仅在showPreview为true时显示 */}
			{showPreview && activeIdx !== null && files[activeIdx]?.code && (
				<div className="w-full p-4 border-t bg-[#f8f8fa] text-xs font-mono overflow-auto">
					<FilePreview
						code={files[activeIdx].code!}
						fileName={files[activeIdx].name}
						keyword={inputValue}
					/>
				</div>
			)}
		</div>
	);
};

export default FileSearchList;
