import type { Dispatch, SetStateAction } from 'react';

export type PanelState = {
	rightOpen: boolean;
	leftOpen: boolean;
};

export type PanelStateSetter = Dispatch<SetStateAction<PanelState>>;
