'use client';

import { useCallback, useEffect, useState } from 'react';

import Body from './components/Body';
import SidebarTabs, { SidebarTabValue } from './components/SidebarTabs';
import useAsideWidth from './hooks/useAsideWidth';
// import type { PanelState } from './types/panelState';
import { SearchDialogStateTag } from './types/searchDialogState';

// const initialPanelState: PanelState = {
// 	rightOpen: true,
// 	leftOpen: true
// };

export default function App() {
	const [activeTab, setActiveTab] = useState<SidebarTabValue>('garden-echo');
	const [searchDialogState, setSearchDialogState] = useState<{
		open: boolean;
		seedTags: SearchDialogStateTag[];
		seedKey?: number;
	}>({
		open: false,
		seedTags: [],
		seedKey: undefined
	});
	const { asideWidth, handleMouseDown } = useAsideWidth();

	const handleTabClick = (tab: SidebarTabValue) => {
		setActiveTab(tab);
	};
	const prepareSearchDialogOpen = (seedTags: SearchDialogStateTag[], open = true) => {
		setSearchDialogState({
			open,
			seedTags,
			seedKey: Date.now()
		});
	};
	const openSearchWithActiveRepo = () => {
		prepareSearchDialogOpen([SearchDialogStateTag.AddRepo]);
	};
	const openSearchWithRepoTag = () => {
		prepareSearchDialogOpen([]);
	};
	const closeSearchDialog = () => {
		setSearchDialogState({
			open: false,
			seedTags: [],
			seedKey: undefined
		});
	};

	return (
		<div className="flex mx-auto bg-white h-[100vh]" style={{ position: 'relative' }}>
			<aside className="flex flex-col h-full p-2" style={{ width: asideWidth, minWidth: 58 }}>
				<SidebarTabs
					active={activeTab}
					onClickTab={handleTabClick}
					onNewTab={openSearchWithActiveRepo}
					asideWidth={asideWidth}
				/>
			</aside>
			{/* 分隔条绝对定位，不占宽度 */}
			<div
				style={{
					position: 'absolute',
					left: asideWidth - 2,
					top: 0,
					width: 4,
					height: '100%',
					cursor: 'ew-resize',
					background: 'transparent',
					zIndex: 100
				}}
				onMouseDown={handleMouseDown}
				className="select-none"
			/>
			<div style={{ flex: 1, height: '100%' }}>
				<Body
					searchDialogOpen={searchDialogState.open}
					searchSeedTags={searchDialogState.seedTags}
					searchSeedKey={searchDialogState.seedKey}
					onHeaderSearchTriggerOpen={openSearchWithRepoTag}
					closeSearchDialog={closeSearchDialog}
				/>
			</div>
		</div>
	);
}
