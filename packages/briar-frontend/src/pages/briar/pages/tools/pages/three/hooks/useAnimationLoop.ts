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

import { threeContainer } from '../container';
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
		cameraPosition,
		setCameraPosition,
		setRolePosition,
		isJumpingRef,
		roleModelRef,
		velocityRef,
		gravityRef
	} = useContainer(threeContainer);
	const { animation, control } = props;
	const { update } = useClock();
	const clockRef = useRef(new THREE.Clock());
	const cameraPositionRef = useRef(cameraPosition);

	useEffect(() => {
		if (!scene || !camera || !renderer) return;

		const animate = () => {
			requestAnimationFrame(animate);

			const delta = update() / 1000.0;

			// 相机位置变化
			const cameraPositionRefXYZ = pick(cameraPositionRef.current, ['x', 'y', 'z']);
			const cameraPositionXYZ: {
				x: number;
				y: number;
				z: number;
			} = pick(camera.position, ['x', 'y', 'z']);
			if (JSON.stringify(cameraPositionRefXYZ) !== JSON.stringify(cameraPositionXYZ)) {
				setCameraPosition(cameraPositionXYZ);
				cameraPositionRef.current = cameraPositionXYZ;
			}

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
