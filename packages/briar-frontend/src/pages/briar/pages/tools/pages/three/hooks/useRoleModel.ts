import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { useContainer } from '@/pages/briar/hooks/useContainer';

import { threeContainer } from '../container';
import { AnimationState } from '../type';

const useRoleModel = (modelUrl: string) => {
	const { scene, rolePosition, roleModelRef } = useContainer(threeContainer);
	const loaderRef = useRef(new GLTFLoader());
	// const clockRef = useRef(new THREE.Clock());
	const [animation, setAnimation] = useState<AnimationState>({
		mixer: {} as THREE.AnimationMixer,
		actions: {},
		animations: []
	});

	useEffect(() => {
		if (!scene) return;

		loaderRef.current.load(modelUrl, (gltf) => {
			const loadedModel = gltf.scene;
			roleModelRef.current = loadedModel;

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
			loadedModel.position.set(rolePosition.x, rolePosition.y, rolePosition.z);
			scene.add(loadedModel);
		});

		return () => {
			if (roleModelRef.current) {
				scene.remove(roleModelRef.current);
			}
		};
	}, [scene, modelUrl]);

	return { animation };
};

export default useRoleModel;
