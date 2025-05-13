import { pick } from 'lodash-es';
import { useCallback } from 'react';
import * as THREE from 'three';

import { useContainer } from '@/pages/briar/hooks/useContainer';

import { HORIZONTAL_SPEED } from '../../constants';
import { threeContainer } from '../../container';
import { keyEventManager } from '../../event';

const useMove = () => {
	const { camera, setRolePosition, velocityRef, roleModelRef, isJumpingRef, gravityRef } =
		useContainer(threeContainer);

	const jump = useCallback(
		(delta: number) => {
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
		},
		[gravityRef, isJumpingRef, roleModelRef, velocityRef]
	);

	const move = useCallback(
		(delta: number) => {
			if (roleModelRef.current && camera) {
				const { pressedDetail } = keyEventManager.ifPressed(['KeyW', 'KeyS', 'KeyA', 'KeyD']);
				const [pressW, pressS, pressA, pressD] = pressedDetail;

				// 如果有任何移动按键按下
				if (pressW || pressS || pressA || pressD) {
					const moveDirection = new THREE.Vector3(0, 0, 0);
					let hasMovement = false;

					// 处理前后移动 (W/S)
					if (pressW || pressS) {
						const forward = new THREE.Vector3();
						forward.setFromMatrixColumn(camera.matrix, 2); // 相机Z轴方向
						forward.y = 0;
						forward.normalize();
						forward.multiplyScalar(pressW ? -1 : 1); // W向前，S向后
						moveDirection.add(forward);
						hasMovement = true;
					}

					// 处理左右移动 (A/D)
					if (pressA || pressD) {
						const right = new THREE.Vector3();
						right.setFromMatrixColumn(camera.matrix, 0); // 相机X轴方向
						right.y = 0;
						right.normalize();
						right.multiplyScalar(pressD ? 1 : -1); // D向右，A向左
						moveDirection.add(right);
						hasMovement = true;
					}

					// 如果有移动输入
					if (hasMovement) {
						// 归一化移动方向（防止对角线移动速度更快）
						moveDirection.normalize();

						// 应用移动
						roleModelRef.current.position.x += moveDirection.x * HORIZONTAL_SPEED * delta;
						roleModelRef.current.position.z += moveDirection.z * HORIZONTAL_SPEED * delta;

						// 更新角色朝向（只面向移动方向，不考虑后退）
						if (pressW || pressA || pressD || pressS) {
							const targetAngle = Math.atan2(moveDirection.x, moveDirection.z);
							// 平滑旋转（可选）
							roleModelRef.current.rotation.y = targetAngle;
						}

						setRolePosition(pick(roleModelRef.current.position, ['x', 'y', 'z']));
					}
				}
			}
		},
		[camera, roleModelRef]
	);

	return {
		jump,
		move
	};
};

export default useMove;
