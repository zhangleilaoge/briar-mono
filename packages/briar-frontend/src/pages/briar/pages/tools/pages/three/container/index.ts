import { useRef, useState } from 'react';
import * as THREE from 'three';

import { createContainer } from '@/pages/briar/hooks/useContainer';

const useThreeState = () => {
	// 核心
	const [scene, setScene] = useState<THREE.Scene | null>(null);
	const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
	const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
	const [cameraPosition, setCameraPosition] = useState({
		x: 0,
		y: 0,
		z: 0
	});
	// 模型
	const roleModelRef = useRef<THREE.Group | null>(null);
	const [rolePosition, setRolePosition] = useState({
		x: 0,
		y: 0,
		z: 0
	});
	// 动画
	const isJumpingRef = useRef(false);
	const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
	const gravityRef = useRef(9.8); // 重力加速度

	return {
		scene,
		camera,
		renderer,
		cameraPosition,
		rolePosition,
		setScene,
		setCamera,
		setRenderer,
		setCameraPosition,
		setRolePosition,
		velocityRef,
		isJumpingRef,
		roleModelRef,
		gravityRef
	};
};

export const threeContainer = createContainer(useThreeState);
