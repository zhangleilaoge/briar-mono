import useAnimationLoop from './useAnimationLoop';
import useControl from './useControl';
import useGround from './useGround';
import useLights from './useLights';
import useModelLoader from './useModelLoader';
import useResizeHandler from './useResizeHandler';
import useThreeCore from './useThreeCore';

export const useThreeScene = (
	containerRef: React.RefObject<HTMLDivElement>,
	options: {
		width: number;
		height: number;
		modelUrl: string;
	}
) => {
	const { width, height, modelUrl } = options;

	// 初始化核心 Three.js 对象
	const { scene, camera, renderer } = useThreeCore(containerRef, { width, height });

	useGround({
		scene,
		options: { width, height }
	});

	const control = useControl({
		camera,
		renderer
	});

	// 添加光照
	useLights(scene);

	// 加载模型和动画
	const { model, animation, clock } = useModelLoader(scene, modelUrl);

	// 设置动画循环
	useAnimationLoop({
		scene,
		camera,
		renderer,
		animation,
		clock,
		control
	});

	// 处理窗口大小变化
	useResizeHandler(camera, renderer, width, height);

	return { scene, camera, renderer, model, animation };
};
