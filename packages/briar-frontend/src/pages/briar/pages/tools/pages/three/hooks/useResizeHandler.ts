import { useEffect } from 'react';
import * as THREE from 'three';

const useResizeHandler = (
	camera: THREE.PerspectiveCamera | null,
	renderer: THREE.WebGLRenderer | null,
	width: number,
	height: number
) => {
	useEffect(() => {
		const handleResize = () => {
			if (camera && renderer) {
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				renderer.setSize(width, height);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [camera, renderer, width, height]);
};

export default useResizeHandler;
