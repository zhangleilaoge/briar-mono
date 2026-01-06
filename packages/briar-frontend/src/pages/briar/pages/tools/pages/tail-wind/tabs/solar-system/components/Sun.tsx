/* eslint-disable react/no-unknown-property */
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Sun: React.FC = () => {
	const meshRef = useRef<THREE.Mesh>(null);
	const SUN_URL =
		'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/runtime-images/17677020207732k_sun.jpg';
	const sunTexture = useTexture(SUN_URL);

	useEffect(() => {
		if (sunTexture) {
			sunTexture.colorSpace = THREE.SRGBColorSpace;
			sunTexture.anisotropy = 8;
			sunTexture.needsUpdate = true;
		}
	}, [sunTexture]);

	useFrame(({}) => {
		if (meshRef.current) {
			meshRef.current.rotation.y += 0.002;
		}
	});

	return (
		<mesh ref={meshRef} position={[0, 0, 0]}>
			<sphereGeometry args={[4, 32, 32]} />
			<meshBasicMaterial color="#ffffff" map={sunTexture} />
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
