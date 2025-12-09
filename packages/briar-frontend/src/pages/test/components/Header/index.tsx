'use client';

// import type { PanelState, PanelStateSetter } from '../../types/panelState';
import BranchDropdown from './components/BranchDropdown';
import HeaderSearchTrigger from './Search';

// const RIGHT_CLOSE =
// 	'https://img01.yzcdn.cn/upload_files/2025/11/28/FsJAlyzLOxUhANEwHt4ESRaQFnoj.png';
// const RIGHT_OPEN =
// 	'https://img01.yzcdn.cn/upload_files/2025/11/28/FoVmuQ-pbxeyRh3AFhKkxoc8oqpt.png';
// const LEFT_OPEN = 'https://img01.yzcdn.cn/upload_files/2025/11/28/Fh43lam8nm5H48-quMxVQy9Qsq5X.png';
// const LEFT_CLOSE =
// 	'https://img01.yzcdn.cn/upload_files/2025/11/28/FikgPkaIj_gykYzMqr_IkRbDnTB0.png';

export interface HeaderProps {
	// panelState: PanelState;
	// setPanelState: PanelStateSetter;
	searchDialogOpen: boolean;
	searchSeedTags: string[];
	searchSeedKey?: number;
	onHeaderSearchTriggerOpen: () => void;
	closeSearchDialog: () => void;
}

export default function Header({
	// panelState,
	// setPanelState,
	searchDialogOpen,
	searchSeedTags,
	searchSeedKey,
	onHeaderSearchTriggerOpen,
	closeSearchDialog
}: HeaderProps) {
	// const { rightOpen, leftOpen } = panelState;

	return (
		<header className="flex items-center justify-between w-full px-4 h-12">
			<BranchDropdown className="basis-[160px]" />

			<div className="flex items-center gap-2 px-1 basis-[350px] h-6 bg-[#FAFAFA] border border-[#A3A3A3] rounded justify-between">
				<div className="w-[36px]" />
				<HeaderSearchTrigger
					open={searchDialogOpen}
					seedTags={searchSeedTags}
					seedKey={searchSeedKey}
					onTriggerOpen={onHeaderSearchTriggerOpen}
					closeSearchDialog={closeSearchDialog}
				/>
				<div className="flex gap-2 w-[36px]">
					<div className="flex gap-1">
						<div className="w-4 h-4 flex items-center justify-center border border-[#A3A3A3] rounded">
							<span className="text-[10px] text-[#A3A3A3]">⌘</span>
						</div>
						<div className="w-4 h-4 flex items-center justify-center border border-[#A3A3A3] rounded">
							<span className="text-[10px] text-[#A3A3A3]">F</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-2 w-[180px] flex-row-reverse">
				{/* 交互先不变暂且注释 */}
				{/* <img
					className="flex items-center gap-2 w-[14px] h-[14px] bg-[#FAFAFA] cursor-pointer"
					src={rightOpen ? RIGHT_OPEN : RIGHT_CLOSE}
					onClick={() =>
						setPanelState((prev) => ({
							...prev,
							rightOpen: !prev.rightOpen
						}))
					}
				/>
				<img
					className="flex items-center gap-2 w-[14px] h-[14px] bg-[#FAFAFA] cursor-pointer"
					src={leftOpen ? LEFT_OPEN : LEFT_CLOSE}
					onClick={() =>
						setPanelState((prev) => ({
							...prev,
							leftOpen: !prev.leftOpen
						}))
					}
				/> */}
			</div>
		</header>
	);
}
