/*
 * @Description:
 * @Author: zhanglei
 * @Date: 2025-04-09 10:47:41
 * @LastEditTime: 2025-04-22 11:12:18
 * @LastEditors: zhanglei
 * @Reference:
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import useClock from '@/pages/briar/hooks/useClock';
import { useContainer } from '@/pages/briar/hooks/useContainer';

import { threeContainer } from '../container';
import { AnimationState } from '../type';
import useMove from './physical/useMove';

interface AnimationLoopProps {
	animation: AnimationState;
	control: OrbitControls | null;
}

const useAnimationLoop = (props: AnimationLoopProps) => {
	const { scene, camera, renderer, rolePosition } = useContainer(threeContainer);
	const { jump, move } = useMove();
	const { animation, control } = props;
	const { update } = useClock();
	const clockRef = useRef(new THREE.Clock());

	// 更新相机位置，使其跟随角色
	useEffect(() => {
		if (!camera || !control) return;

		const offset = new THREE.Vector3();

		offset.copy(camera.position).sub(control.target);
		camera?.position.copy(rolePosition).add(offset); // 使用偏移向量更新相机位置
		control?.target.copy(rolePosition); // 更新控制器的目标位置
	}, [camera, control, rolePosition]);

	useEffect(() => {
		if (!scene || !camera || !renderer) return;

		const animate = () => {
			requestAnimationFrame(animate);

			const delta = update() / 1000.0;

			// 角色跳跃
			jump(delta);

			// 角色水平移动
			move(delta);

			if (control) {
				control.update();
			}
			animation.mixer?.update?.(clockRef.current.getDelta());

			renderer.render(scene, camera);
		};
		animate();
	}, [scene, camera, renderer, animation, control]);

	return {};
};

export default useAnimationLoop;
