'use client';

// import type { PanelState, PanelStateSetter } from '../../types/panelState';
import Header from '../Header';
// import BranchDropdown from './components/BranchDropdown';

interface BodyProps {
	// panelState: PanelState;
	// setPanelState: PanelStateSetter;
	searchDialogOpen: boolean;
	searchSeedTags: string[];
	searchSeedKey?: number;
	onHeaderSearchTriggerOpen: () => void;
	closeSearchDialog: () => void;
}

export default function Body({
	// panelState,
	// setPanelState,
	searchDialogOpen,
	searchSeedTags,
	searchSeedKey,
	onHeaderSearchTriggerOpen,
	closeSearchDialog
}: BodyProps) {
	return (
		<div className="flex flex-col flex-1 gap-4 bg-[#FAFAFA] h-full">
			<Header
				// panelState={panelState}
				// setPanelState={setPanelState}
				searchDialogOpen={searchDialogOpen}
				searchSeedTags={searchSeedTags}
				searchSeedKey={searchSeedKey}
				onHeaderSearchTriggerOpen={onHeaderSearchTriggerOpen}
				closeSearchDialog={closeSearchDialog}
			/>
			<main className="flex flex-col gap-4 flex-1">
				<div className="text-sm text-gray-600">Main</div>
			</main>
		</div>
	);
}
