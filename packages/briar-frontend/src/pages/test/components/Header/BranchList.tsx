import React from 'react';

import { CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

export interface BranchInfo {
	name: string;
	commit: string;
	commitMsg: string;
	author: string;
}

interface BranchListProps {
	branches: BranchInfo[];
	inputValue?: string;
}

function highlight(text: string, keyword?: string) {
	if (!keyword) return text;
	const re = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
	return text.replace(
		re,
		(match) => `<mark style="background:#ffeeba;font-weight:bold;">${match}</mark>`
	);
}

const BranchList: React.FC<BranchListProps> = ({ branches, inputValue }) => {
	return (
		<div className="flex-1 min-h-0 overflow-auto rounded bg-white">
			<CommandList>
				<CommandGroup heading="">
					{branches.length === 0 ? (
						<CommandItem value="empty" disabled>
							<span className="text-xs text-gray-400">暂无匹配分支</span>
						</CommandItem>
					) : (
						branches.map((branch) => (
							<CommandItem key={branch.name} value={branch.name}>
								<div className="flex flex-col gap-1">
									<span
										className="font-medium text-sm"
										dangerouslySetInnerHTML={{ __html: highlight(branch.name, inputValue) }}
									/>
									<div className="flex gap-2 items-center text-xs text-gray-500">
										<span className="bg-gray-100 px-1 rounded font-mono">{branch.commit}</span>
										<span className="truncate max-w-[180px]" title={branch.commitMsg}>
											{branch.commitMsg}
										</span>
										<span className="text-[#1a3b75]">{branch.author}</span>
									</div>
								</div>
							</CommandItem>
						))
					)}
				</CommandGroup>
			</CommandList>
		</div>
	);
};

export default BranchList;
