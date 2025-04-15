import { useEffect } from 'react';
import * as THREE from 'three';

const useLights = (scene: THREE.Scene | null) => {
	useEffect(() => {
		if (!scene) return;

		// 1. 添加环境光 - 基础照明
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // 强度降低到0.3
		scene.add(ambientLight);

		// 2. 添加来自后上方的定向光
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 强度设为0.8
		directionalLight.position.set(-5, 10, 5); // 后上方位置 (x负向，y正向，z正向)

		// 可选：添加阴影支持（如果需要）
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 1024;
		directionalLight.shadow.mapSize.height = 1024;

		scene.add(directionalLight);

		// 3. 可选：添加辅助光（减少阴影死黑）
		const fillLight = new THREE.DirectionalLight(0xffffff, 0.2);
		fillLight.position.set(5, 5, 5); // 前上方补光
		scene.add(fillLight);

		return () => {
			scene.remove(ambientLight);
			scene.remove(directionalLight);
			if (fillLight) scene.remove(fillLight);
		};
	}, [scene]);
};

export default useLights;
