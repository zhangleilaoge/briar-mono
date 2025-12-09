'use client';

import { Plus } from 'lucide-react';

export type SidebarTabValue = 'echo-manage' | 'echo-ai' | 'garden-echo';

export interface SidebarTabsProps {
	active?: SidebarTabValue;
	onHoverTab?: (tab: SidebarTabValue) => void;
	onClickTab?: (tab: SidebarTabValue) => void;
	onNewTab?: () => void;
	asideWidth?: number;
}

const tabs: Array<{ label: string; value: SidebarTabValue }> = [
	{ label: 'echo-manage', value: 'echo-manage' },
	{ label: 'echo-ai', value: 'echo-ai' },
	{ label: 'garden-echo', value: 'garden-echo' }
];

// Accentx 粉色系列
const ACCENTX_COLORS = [
	'#fde9f0', // 50
	'#f9cfe0', // 100
	'#f5b4d1', // 200
	'#f19abf', // 300
	'#ed80b0', // 400
	'#ed648c', // 500
	'#d3567d', // 600
	'#b7446a', // 700
	'#952d52', // 800
	'#7a2141' // 900
];
// 仓库名hash到颜色
function getAccentColor(repo: string) {
	let hash = 0;
	for (let i = 0; i < repo.length; i++) {
		hash = (hash * 31 + repo.charCodeAt(i)) % 9973;
	}
	return ACCENTX_COLORS[hash % ACCENTX_COLORS.length];
}

export default function SidebarTabs({
	active = 'garden-echo',
	onClickTab,
	onNewTab,
	asideWidth = 168
}: SidebarTabsProps) {
	const compact = asideWidth <= 150;
	// 获取最多两个大写字母
	function getAbbr(label: string) {
		// 取每个单词首字母，最多两个
		const words = label.split(/[-_ ]+/).filter(Boolean);
		return words
			.slice(0, 2)
			.map((w) => w[0].toUpperCase())
			.join('');
	}

	return (
		<div className="flex flex-col gap-2 w-full">
			<div className="pb-3 border-b border-[#E6E6E6] mb-1 flex items-center justify-center">
				<img
					className="w-7 h-7 cursor-pointer ml-[2px] mt-[2px]"
					aria-label="logo"
					src="https://img01.yzcdn.cn/upload_files/2025/11/28/FoiFc_pfLmixKVWKZNlXU7xNuGZp.png"
					onClick={() => window.open('/idev')}
				/>
			</div>
			{tabs.map(({ label, value }) => {
				const isActive = value === active;
				// const accentColor = getAccentColor(label);
				// console.log('SidebarTabs render', accentColor);
				const baseClasses =
					'cursor-pointer transition-all duration-150 flex items-center gap-[10px] px-2 h-10 w-full rounded';
				const activeClasses = `bg-white border text-[#d3567d] border-[#d3567d] shadow-[4px_4px_0px_0px_#d3567d] hover:-translate-y-0.5 hover:shadow-[4px_6px_0px_0px_#d3567d] hover:border-[#d3567d]`;
				const inactiveClasses =
					'border-transparent text-[#7A7A7A] hover:text-[#2f2f2f] hover:-translate-y-0.5';
				const compactActiveClasses = `text-white bg-[#d3567d] border border-[#7A7A7A] shadow-[4px_4px_0px_0px_#7a7a7a]`;
				const compactInactiveClasses = 'bg-[#fafafa] text-[#7a7a7a]';
				const tabClass = compact
					? `${baseClasses} ${isActive ? compactActiveClasses : compactInactiveClasses}`
					: `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
				return (
					<div key={value} className={tabClass} onClick={() => onClickTab?.(value)}>
						{compact ? (
							<span className="font-semibold" style={{ fontSize: 16, letterSpacing: 2 }}>
								{getAbbr(label)}
							</span>
						) : (
							<span className="text-xs font-medium leading-[1.66em]">{label}</span>
						)}
					</div>
				);
			})}
			<div
				className="cursor-pointer flex items-center gap-1 px-2 h-10 w-full rounded text-[#A3A3A3] transition-transform duration-150 hover:-translate-y-0.5 hover:text-[#444]"
				onClick={() => onNewTab?.()}
			>
				<Plus className={compact ? 'w-[24px] h-[24px]' : 'w-[14px] h-[14px]'} />
				{!compact && <span className="text-xs font-medium leading-[1.66em]">new Tab</span>}
			</div>
		</div>
	);
}
