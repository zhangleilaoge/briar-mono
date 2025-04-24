import { useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { useContainer } from '@/pages/briar/hooks/useContainer';

import { JUMP_INITIAL_VELOCITY } from '../constants';
import { threeContainer } from '../container';
import { keyEventManager } from '../event';

interface IProps {}

const useControl = (_props: IProps) => {
	const { camera, renderer, velocityRef, isJumpingRef, roleModelRef } =
		useContainer(threeContainer);
	const [controls, setControls] = useState<OrbitControls | null>(null);

	const jumpHandler = useCallback(() => {
		// 如果角色模型存在且当前没有在跳跃状态下，执行跳跃动画
		if (!isJumpingRef.current && roleModelRef.current) {
			isJumpingRef.current = true;
			velocityRef.current.y = JUMP_INITIAL_VELOCITY; // 初始跳跃速度
		}
	}, []);

	useEffect(() => {
		keyEventManager.subscribe({
			key: 'Space',
			callback: jumpHandler,
			name: 'jump',
			eventType: 'down'
		});
		keyEventManager.subscribe({
			key: 'KeyW',
			callback: () => {},
			name: 'move',
			eventType: 'down'
		});
		keyEventManager.subscribe({
			key: 'KeyW',
			callback: () => {},
			name: 'move',
			eventType: 'up'
		});
		keyEventManager.subscribe({
			key: 'KeyS',
			callback: () => {},
			name: 'move',
			eventType: 'down'
		});
		keyEventManager.subscribe({
			key: 'KeySw',
			callback: () => {},
			name: 'move',
			eventType: 'up'
		});

		return () => {
			keyEventManager.unsubscribe({
				name: 'jump'
			});
			keyEventManager.unsubscribe({
				name: 'move'
			});
		};
	}, [jumpHandler]);

	useEffect(() => {
		// 初始化控制器
		if (camera && renderer) {
			const orbitControls = new OrbitControls(camera, renderer.domElement);

			// 交换左右键功能
			orbitControls.mouseButtons = {
				// LEFT: THREE.MOUSE.PAN, // 左键变为平移
				MIDDLE: THREE.MOUSE.DOLLY, // 中键缩放
				RIGHT: THREE.MOUSE.ROTATE // 右键变为旋转
			};

			// 配置控制器参数
			orbitControls.enableDamping = true; // 启用阻尼效果，使旋转更平滑
			orbitControls.dampingFactor = 0.1; // 阻尼系数
			orbitControls.screenSpacePanning = false; // 定义平移时如何平移相机
			orbitControls.minDistance = 0.5; // 最小缩放距离
			orbitControls.maxDistance = 10; // 最大缩放距离
			orbitControls.maxPolarAngle = Math.PI; // 最大垂直旋转角度（180度）

			setControls(orbitControls);
		}
	}, [camera, renderer]);

	return controls;
};

export default useControl;
