export interface PlanetData {
	name: string;
	color: string;
	size: number;
	distance: number; // Distance from sun
	speed: number; // Orbit speed
	description: string;
	hasRings?: boolean;
}

export interface PlanetProps {
	planet: PlanetData;
	isSelected: boolean;
	onSelect: (name: string) => void;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
