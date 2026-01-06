/* eslint-disable react/no-unknown-property */
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense, useState } from 'react';
import * as THREE from 'three';

import { InfoPanel } from './components/InfoPanel';
import { Planet } from './components/Planet';
import { Sun } from './components/Sun';
import { PLANETS } from './constants';

// This component is designed to fill its parent container.
// Ensure the parent has a defined height/width.
const SolarSystem: React.FC = () => {
	const [selectedPlanetName, setSelectedPlanetName] = useState<string | null>(null);

	const handlePlanetSelect = (name: string) => {
		setSelectedPlanetName(name);
	};

	const handleClosePanel = () => {
		setSelectedPlanetName(null);
	};

	const selectedPlanetData = PLANETS.find((p) => p.name === selectedPlanetName) || null;

	return (
		<div className="relative w-full h-[calc(100vh-170px)] bg-black overflow-hidden">
			{/* 3D Scene */}
			<Canvas
				className="w-full h-[calc(100vh-170px)]"
				gl={{ outputColorSpace: THREE.SRGBColorSpace }}
			>
				<Suspense fallback={null}>
					<PerspectiveCamera makeDefault position={[0, 40, 70]} fov={45} />

					<OrbitControls
						enablePan={true}
						enableZoom={true}
						enableRotate={true}
						minDistance={10}
						maxDistance={200}
						target={[0, 0, 0]}
					/>

					<ambientLight intensity={0.9} />

					{/* Stars Background */}
					<Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

					{/* Solar System Objects */}
					<Sun />

					{PLANETS.map((planet) => (
						<Planet
							key={planet.name}
							planet={planet}
							isSelected={selectedPlanetName === planet.name}
							onSelect={handlePlanetSelect}
						/>
					))}
				</Suspense>
			</Canvas>

			{/* UI Overlay */}
			<div className="absolute top-6 left-6 pointer-events-none z-10">
				<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tighter drop-shadow-lg">
					SOLAR EXPLORER
				</h1>
				<p className="text-gray-400 text-sm mt-1 max-w-xs drop-shadow-md">
					Drag to rotate. Scroll to zoom. Click a planet to discover facts powered by Gemini.
				</p>
			</div>

			{/* Info Sidebar */}
			<InfoPanel planet={selectedPlanetData} onClose={handleClosePanel} />
		</div>
	);
};

export default SolarSystem;
