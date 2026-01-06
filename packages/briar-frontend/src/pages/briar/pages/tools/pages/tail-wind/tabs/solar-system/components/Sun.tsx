import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';

export const Sun: React.FC = () => {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame(({}) => {
		if (meshRef.current) {
			meshRef.current.rotation.y += 0.002;
		}
	});

	return (
		<mesh ref={meshRef} position={[0, 0, 0]}>
			<sphereGeometry args={[4, 32, 32]} />
			<meshBasicMaterial color="#FDB813" />
			{/* Light Source from Sun */}
			<pointLight intensity={2} distance={100} decay={1} color="#ffffff" />
			{/* Ambient glow mesh */}
			<mesh scale={[1.1, 1.1, 1.1]}>
				<sphereGeometry args={[4, 32, 32]} />
				<meshBasicMaterial color="#FDB813" transparent opacity={0.2} side={THREE.BackSide} />
			</mesh>
		</mesh>
	);
};
