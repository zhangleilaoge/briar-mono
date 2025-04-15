import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
 * @Description:
 * @Author: zhanglei
 * @Date: 2025-04-09 11:23:17
 * @LastEditTime: 2025-04-09 11:23:18
 * @LastEditors: zhanglei
 * @Reference:
 */

interface IProps {
	scene: THREE.Scene | null;
	options: { width: number; height: number };
}

const useBackground = (props: IProps) => {
	const { scene, options } = props;
	const backgroundRef = useRef<THREE.Mesh | null>(null);
	useEffect(() => {
		if (!scene) return;

		const gradientTexture = new THREE.TextureLoader().load(
			'https://img01.yzcdn.cn/upload_files/2025/04/09/Fmz6XxtVURtNzWEElqE45ziS0NIw.png',
			(texture) => {
				// 1. 计算图片和场景的宽高比
				const imgAspect = texture.image.width / texture.image.height;
				console.log('imgAspect', imgAspect);
				const sceneAspect = options.width / options.height;

				// 2. 创建平面几何体
				const geometry = new THREE.PlaneGeometry(2.5, 2.5); // 初始大小

				// 3. 根据比例调整平面大小
				if (imgAspect > sceneAspect) {
					// 图片比场景更宽（横向长图）
					geometry.scale(sceneAspect / imgAspect, 1, 1);
				} else {
					// 图片比场景更高（竖向长图）
					geometry.scale(1, sceneAspect / imgAspect, 1);
				}

				// 4. 创建材质并设置纹理
				const material = new THREE.MeshBasicMaterial({
					map: texture,
					depthTest: false,
					depthWrite: false
				});

				// 5. 创建背景平面
				const background = new THREE.Mesh(geometry, material);
				background.position.z = 0; // 放在相机后面

				// 6. 添加到场景
				scene.add(background);

				// 7. 保存引用以便清理
				backgroundRef.current = background;
			}
		);

		return () => {
			if (backgroundRef.current) {
				scene.remove(backgroundRef.current);
				backgroundRef.current.geometry.dispose();
			}
			if (gradientTexture instanceof THREE.Texture) {
				gradientTexture.dispose();
			}
		};
	}, [options.height, options.width, scene]);
};

export default useBackground;
