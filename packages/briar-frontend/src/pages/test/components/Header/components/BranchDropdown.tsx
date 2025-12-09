'use client';

import { ChevronDown, GitBranch, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const branchOptions = [
	{
		name: 'Main',
		description: 'Bugmaker(李俊) · feat: 更新线稿片头样式',
		updated: '6 days ago'
	},
	{
		name: 'Garden Echo',
		description: 'Bugmaker(李俊) · refactor: 调整模块边框',
		updated: '12 days ago'
	},
	{
		name: 'Bugfix/emoji',
		description: 'Bugmaker(李俊) · fix: 修复侧栏收起状态',
		updated: '2 weeks ago'
	}
];

//
export default function BranchDropdown({ className = '' }: { className?: string }) {
	const [selectedBranch, setSelectedBranch] = useState(branchOptions[0]);
	const [filterText, setFilterText] = useState('');
	const filteredBranches = useMemo(
		() =>
			branchOptions.filter((branch) =>
				branch.name.toLowerCase().includes(filterText.toLowerCase())
			),
		[filterText]
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={`${className} flex items-center gap-2 justify-between rounded-md border border-[#d0d0d0] bg-white p-1 text-left text-sm shadow-sm transition hover:border-[#a9a9a9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400`}
				>
					{/* <GitBranch className="w-[14px]" /> */}
					<img
						src="https://img01.yzcdn.cn/upload_files/2025/11/28/FiC3-uRG10LyKjfo6isyVSsECwmM.png"
						alt="branch icon"
						className="w-[14px] h-[14px]"
					/>
					<span className="text-xs overflow-hidden whitespace-nowrap text-ellipsis">
						{selectedBranch.name}
					</span>
					<ChevronDown className="h-4 w-4 text-[#707070]" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-full border border-[#e2e2e2] bg-white p-2 shadow-lg"
				align="start"
			>
				<div className="flex items-center rounded-md border border-[#f0f0f0] px-3 py-2 text-xs text-[#5a5a5a]">
					<input
						className="w-full bg-transparent text-xs outline-none"
						placeholder="支持搜索"
						value={filterText}
						onChange={(event) => setFilterText(event.target.value)}
					/>
				</div>
				<div className="py-2 gap-2 flex flex-col max-h-[200px] overflow-y-auto">
					{filteredBranches.map((branch) => {
						const isSelected = branch.name === selectedBranch.name;
						return (
							<DropdownMenuItem
								key={branch.name}
								onSelect={() => {
									setSelectedBranch(branch);
									setFilterText('');
								}}
								className={cn(
									'flex w-full flex-col rounded-md px-3 py-2 text-left text-xs transition text-[#a0a0a0] gap-0 cursor-pointer',
									isSelected
										? 'bg-[#f57f93] text-white data-[highlighted]:bg-[#f78aa0] focus-visible:bg-[#f78aa0] data-[highlighted]:text-white focus-visible:text-white'
										: 'bg-white text-[#333] '
								)}
							>
								<div className="flex items-center justify-between w-full">
									<span className="text-sm font-semibold leading-tight">{branch.name}</span>
									<span className="text-[10px] ">{branch.updated}</span>
								</div>
								<p className="mt-1 text-[10px]">{branch.description}</p>
							</DropdownMenuItem>
						);
					})}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
