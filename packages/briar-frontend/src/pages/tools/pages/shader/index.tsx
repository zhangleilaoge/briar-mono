import { useCallback, useEffect, useRef, useState } from 'react';

import * as THREE from 'three';
import s from './style.module.scss';

const uniforms = {
	u_time: { type: 'f', value: 1.0 },
	u_resolution: { type: 'v2', value: new THREE.Vector2() }
};

const Shader = () => {
	const [frag] = useState(`uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    gl_FragColor=vec4(st.x,st.y,0.0,1.0);
}`);
	// const [vertexShader] = useState(`        void main() {
	//         gl_Position = vec4( position, 1.0 );
	//     }`);
	const renderRef = useRef<THREE.WebGLRenderer>();
	const camera = new THREE.Camera();
	const clock = new THREE.Clock();
	const scene = new THREE.Scene();
	const aniRef = useRef<number>();

	const onWindowResize = useCallback(() => {
		const container = document.getElementsByClassName(s.CanvasContainer)?.[0];
		if (!renderRef.current || !container) return;
		// 正方形
		renderRef.current.setSize(+container.clientHeight, +container.clientHeight);
		uniforms.u_resolution.value.x = renderRef.current.domElement.width;
		uniforms.u_resolution.value.y = renderRef.current.domElement.height;
	}, []);

	const render = useCallback(() => {
		if (!renderRef.current) return;
		uniforms.u_time.value += clock.getDelta();
		renderRef.current.render(scene, camera);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const animate = useCallback(() => {
		aniRef.current = requestAnimationFrame(animate);
		render();
	}, [render]);

	useEffect(() => {
		const container = document.getElementById('canvas');
		if (!container) return;

		camera.position.z = 1;

		const geometry = new THREE.PlaneGeometry(2, 2);

		const material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			fragmentShader: frag
		});

		const mesh = new THREE.Mesh(geometry, material);

		if (!scene.children.includes(mesh)) {
			scene.add(mesh);

			renderRef.current = new THREE.WebGLRenderer();
			renderRef.current.setPixelRatio(window.devicePixelRatio);
			container.appendChild(renderRef.current.domElement);

			onWindowResize();
			window.addEventListener('resize', onWindowResize, false);

			animate();
		}

		return () => {
			aniRef.current && cancelAnimationFrame(aniRef.current);
			window.removeEventListener('resize', onWindowResize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={s.CanvasContainer}>
			<div id="canvas"></div>
		</div>
	);
};

export default Shader;
