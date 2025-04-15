/*
 * @Description:
 * @Author: zhanglei
 * @Date: 2025-04-09 17:53:51
 * @LastEditTime: 2025-04-09 17:53:53
 * @LastEditors: zhanglei
 * @Reference:
 */

import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface IProps {
	camera: THREE.PerspectiveCamera | null;
	renderer: THREE.WebGLRenderer | null;
}

const useControl = (props: IProps) => {
	const { camera, renderer } = props;
	const [controls, setControls] = useState<OrbitControls | null>(null);
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
			orbitControls.dampingFactor = 0.05; // 阻尼系数
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
