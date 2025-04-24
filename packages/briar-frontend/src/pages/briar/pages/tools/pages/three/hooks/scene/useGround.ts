import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { useContainer } from '@/pages/briar/hooks/useContainer';

import { threeContainer } from '../../container';

interface IProps {}

const useGround = (_props: IProps) => {
	const { scene } = useContainer(threeContainer);
	const groundRef = useRef<THREE.Mesh | null>(null);

	useEffect(() => {
		if (!scene) return;

		// 1. 加载地面纹理
		const textureLoader = new THREE.TextureLoader();
		const groundTexture = textureLoader.load(
			'https://img01.yzcdn.cn/upload_files/2025/04/10/FjDxAcoqEpG7vWPzAcCzK1bj6zVp.jpg', // 替换为你的地面纹理URL
			(texture) => {
				// 2. 设置纹理重复以覆盖更大面积
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set(10, 10); // 根据需要调整重复次数

				// 3. 创建地面几何体 - 比场景大很多
				const geometry = new THREE.PlaneGeometry(100, 100);

				// 4. 创建地面材质
				const material = new THREE.MeshStandardMaterial({
					map: groundTexture,
					roughness: 0.8,
					metalness: 0.2
				});

				// 5. 创建地面网格
				const ground = new THREE.Mesh(geometry, material);
				ground.rotation.x = -Math.PI / 2; // 旋转90度使其水平
				ground.position.y = 0; // 调整高度
				ground.receiveShadow = true; // 如果需要阴影

				// 6. 添加到场景
				scene.add(ground);
				groundRef.current = ground;
			}
		);

		return () => {
			if (groundRef.current) {
				scene.remove(groundRef.current);
				groundRef.current.geometry.dispose();
				if (groundRef.current.material instanceof THREE.Material) {
					groundRef.current.material.dispose();
				}
			}
			if (groundTexture instanceof THREE.Texture) {
				groundTexture.dispose();
			}
		};
	}, [scene]);
};

export default useGround;
