export interface PlanetData {
	name: string;
	color: string;
	size: number;
	distance: number; // Distance from sun
	speed: number; // Orbit speed
	description: string;
	hasRings?: boolean;
	// Optional texture URLs
	mapUrl?: string;
	ringMapUrl?: string; // for Saturn-like ring textures
}

export interface PlanetProps {
	planet: PlanetData;
	isSelected: boolean;
	onSelect: (name: string) => void;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
