/*
 * @Description:
 * @Author: zhanglei
 * @Date: 2025-04-09 10:47:41
 * @LastEditTime: 2025-04-22 11:12:18
 * @LastEditors: zhanglei
 * @Reference:
 */

import { pick } from 'lodash-es';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import useClock from '@/pages/briar/hooks/useClock';
import { useContainer } from '@/pages/briar/hooks/useContainer';

import { HORIZONTAL_SPEED } from '../constants';
import { threeContainer } from '../container';
import { keyEventManager } from '../event';
import { AnimationState } from '../type';

interface AnimationLoopProps {
	animation: AnimationState;
	control: OrbitControls | null;
}

const useAnimationLoop = (props: AnimationLoopProps) => {
	const {
		scene,
		camera,
		renderer,
		rolePosition,
		// setCameraPosition,
		setRolePosition,
		isJumpingRef,
		roleModelRef,
		velocityRef,
		gravityRef
	} = useContainer(threeContainer);
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
			if (isJumpingRef.current && roleModelRef.current) {
				roleModelRef.current.position.y += velocityRef.current.y * delta;
				setRolePosition(pick(roleModelRef.current.position, ['x', 'y', 'z']));
				velocityRef.current.y -= gravityRef.current * delta; // 重力影响

				// 落地检测（假设地面是 y=0）
				if (roleModelRef.current.position.y <= 0) {
					roleModelRef.current.position.y = 0;
					setRolePosition(pick(roleModelRef.current.position, ['x', 'y', 'z']));
					isJumpingRef.current = false;
				}
			}

			// 角色水平移动
			if (roleModelRef.current) {
				const pressW = keyEventManager.pressedKeys.has('KeyW');
				const pressS = keyEventManager.pressedKeys.has('KeyS');
				if (pressW || pressS) {
					// 获取相机的前进方向（Z 轴方向）
					const direction = new THREE.Vector3(0, 0, 0);

					direction.setFromMatrixColumn(camera.matrix, 2); // 获取相机的 Z 轴方向
					direction.multiplyScalar(pressW ? -1 : 1); // 取反，因为相机的 Z 轴方向是向后的
					direction.y = 0;
					direction.normalize(); // 归一化确保速度一致
					roleModelRef.current.position.x += direction.x * HORIZONTAL_SPEED * delta;
					roleModelRef.current.position.z += direction.z * HORIZONTAL_SPEED * delta;

					// 更新角色朝向
					const targetAngle = pressW
						? Math.atan2(direction.x, direction.z)
						: Math.atan2(direction.x, direction.z) + Math.PI;
					// Smoothly rotate towards target angle
					roleModelRef.current.rotation.y = targetAngle;

					setRolePosition(pick(roleModelRef.current.position, ['x', 'y', 'z']));
				}
			}

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
