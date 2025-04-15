/*
 * @Description:
 * @Author: zhanglei
 * @Date: 2025-04-09 10:47:41
 * @LastEditTime: 2025-04-09 10:47:42
 * @LastEditors: zhanglei
 * @Reference:
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { AnimationState } from '../type';

interface AnimationLoopProps {
	scene: THREE.Scene | null;
	camera: THREE.PerspectiveCamera | null;
	renderer: THREE.WebGLRenderer | null;
	animation: AnimationState;
	clock: THREE.Clock;
	control: OrbitControls | null;
}

const useAnimationLoop = (props: AnimationLoopProps) => {
	const { scene, camera, renderer, animation, clock, control } = props;
	const [cameraPosition, setCameraPosition] = useState({
		x: 0,
		y: 0,
		z: 0
	});
	const cameraPositionRef = useRef(cameraPosition);
	useEffect(() => {
		if (!scene || !camera || !renderer) return;

		const animate = () => {
			requestAnimationFrame(animate);
			if (
				camera.position.x !== cameraPositionRef.current.x ||
				camera.position.y !== cameraPositionRef.current.y ||
				camera.position.z !== cameraPositionRef.current.z
			) {
				setCameraPosition({
					x: camera.position.x,
					y: camera.position.y,
					z: camera.position.z
				});
				cameraPositionRef.current = {
					x: camera.position.x,
					y: camera.position.y,
					z: camera.position.z
				};
				console.log('cameraPosition', cameraPosition, camera.position);
			}

			animation.mixer?.update?.(clock.getDelta());
			if (control) {
				control.update();
			}
			renderer.render(scene, camera);
		};
		animate();
	}, [scene, camera, renderer, animation, clock, control]);

	return { cameraPosition };
};

export default useAnimationLoop;
