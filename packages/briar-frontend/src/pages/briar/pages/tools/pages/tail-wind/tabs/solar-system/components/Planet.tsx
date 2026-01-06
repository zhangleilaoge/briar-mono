import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';

import { PlanetProps } from '../types';

export const Planet: React.FC<PlanetProps> = ({ planet, isSelected, onSelect }) => {
	const meshRef = useRef<THREE.Mesh>(null);
	const orbitRef = useRef<THREE.Group>(null);
	const [hovered, setHover] = useState(false);

	// Random starting position for visual variety
	const initialAngle = useRef(Math.random() * Math.PI * 2);

	useFrame(({ clock }) => {
		if (orbitRef.current && meshRef.current) {
			const t = clock.getElapsedTime();
			// Orbit calculation
			const angle = initialAngle.current + t * (planet.speed * 0.1);
			const x = Math.cos(angle) * planet.distance;
			const z = Math.sin(angle) * planet.distance;

			meshRef.current.position.set(x, 0, z);

			// Self rotation
			meshRef.current.rotation.y += 0.005 + (1 / planet.size) * 0.005;

			// If has rings, rotate them slightly
			if (planet.hasRings) {
				meshRef.current.children.forEach((child) => {
					if (child.type === 'Mesh' && child !== meshRef.current) {
						child.rotation.x = Math.PI / 2.2; // Tilt the rings
						child.rotation.z += 0.001;
					}
				});
			}
		}
	});

	return (
		<group ref={orbitRef}>
			{/* Orbit Path Visualization */}
			<mesh rotation={[-Math.PI / 2, 0, 0]}>
				<ringGeometry args={[planet.distance - 0.05, planet.distance + 0.05, 128]} />
				<meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
			</mesh>

			{/* The Planet Mesh */}
			<mesh
				ref={meshRef}
				onClick={(e) => {
					e.stopPropagation();
					onSelect(planet.name);
				}}
				onPointerOver={() => {
					document.body.style.cursor = 'pointer';
					setHover(true);
				}}
				onPointerOut={() => {
					document.body.style.cursor = 'auto';
					setHover(false);
				}}
			>
				<sphereGeometry args={[planet.size, 32, 32]} />
				<meshStandardMaterial
					color={planet.color}
					emissive={isSelected ? '#444444' : '#000000'} // Glow slightly when selected
					roughness={0.7}
				/>

				{/* Selection Indicator Halo */}
				{(isSelected || hovered) && (
					<mesh>
						<sphereGeometry args={[planet.size * 1.2, 32, 32]} />
						<meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.BackSide} />
					</mesh>
				)}

				{/* Planet Label */}
				<Html position={[0, planet.size + 1, 0]} center distanceFactor={15}>
					<div
						className={`text-xs font-mono font-bold px-2 py-0.5 rounded pointer-events-none transition-opacity duration-300 ${hovered || isSelected ? 'opacity-100 bg-black/60 text-white' : 'opacity-60 text-gray-300'}`}
					>
						{planet.name}
					</div>
				</Html>

				{/* Saturn's Rings */}
				{planet.hasRings && (
					<mesh rotation={[Math.PI / 2.2, 0, 0]}>
						<ringGeometry args={[planet.size * 1.4, planet.size * 2.2, 64]} />
						<meshStandardMaterial
							color="#C5B595"
							opacity={0.8}
							transparent
							side={THREE.DoubleSide}
						/>
					</mesh>
				)}
			</mesh>
		</group>
	);
};
