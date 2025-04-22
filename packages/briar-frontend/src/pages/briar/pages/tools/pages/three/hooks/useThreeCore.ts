import { useEffect } from 'react';
import * as THREE from 'three';

import { useContainer } from '@/pages/briar/hooks/useContainer';

import { threeContainer } from '../container';

const useThreeCore = (
	containerRef: React.RefObject<HTMLDivElement>,
	options: { width: number; height: number }
) => {
	const { setScene, setCamera, setRenderer } = useContainer(threeContainer);

	useEffect(() => {
		// 初始化场景
		const scene = new THREE.Scene();
		setScene(scene);

		// 初始化相机
		const camera = new THREE.PerspectiveCamera(75, options.width / options.height, 0.1, 1000);
		camera.position.set(0, 2, 3);
		camera.lookAt(0, 0, 0);
		setCamera(camera);

		// 初始化渲染器
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(options.width, options.height);
		renderer.setClearColor(0xf0f0f0);
		// 在初始化渲染器后设置
		setRenderer(renderer);

		// 添加到DOM
		containerRef.current?.appendChild(renderer.domElement);

		return () => {
			containerRef.current?.removeChild(renderer.domElement);

			setScene(null);
			setCamera(null);
			setRenderer(null);
		};
	}, [options.width, options.height, containerRef]);

	return {};
};

export default useThreeCore;
