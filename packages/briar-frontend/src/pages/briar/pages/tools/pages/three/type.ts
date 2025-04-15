import * as THREE from 'three';
import { AnimationClip } from 'three';

export interface AnimationState {
	mixer: THREE.AnimationMixer;
	actions: Record<string, THREE.AnimationAction>;
	animations: AnimationClip[];
}
