import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { AnimationState } from '../type';

const useModelLoader = (scene: THREE.Scene | null, modelUrl: string) => {
	const loaderRef = useRef(new GLTFLoader());
	const clockRef = useRef(new THREE.Clock());
	const [animation, setAnimation] = useState<AnimationState>({
		mixer: {} as THREE.AnimationMixer,
		actions: {},
		animations: []
	});
	const modelRef = useRef<THREE.Group | null>(null);
	const [model, setModel] = useState<THREE.Group | null>(null);

	useEffect(() => {
		if (!scene) return;

		loaderRef.current.load(modelUrl, (gltf) => {
			const loadedModel = gltf.scene;
			setModel(loadedModel);
			modelRef.current = loadedModel;

			const mixer = new THREE.AnimationMixer(loadedModel);
			const actions: Record<string, THREE.AnimationAction> = {};
			gltf.animations.forEach((clip) => {
				actions[clip.name] = mixer.clipAction(clip);
			});
			setAnimation({
				mixer,
				actions,
				animations: gltf.animations
			});

			if (gltf.animations.length > 0) {
				actions[gltf.animations[0].name].play();
			}

			loadedModel.scale.set(100, 100, 100);
			loadedModel.position.set(0, 0, 0);
			scene.add(loadedModel);
		});

		return () => {
			if (modelRef.current) {
				scene.remove(modelRef.current);
			}
		};
	}, [scene, modelUrl]);

	return { model, animation, clock: clockRef.current };
};

export default useModelLoader;
