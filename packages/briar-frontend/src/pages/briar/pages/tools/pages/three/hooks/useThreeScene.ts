import useAnimationLoop from './useAnimationLoop';
import useControl from './useControl';
import useGround from './useGround';
import useLights from './useLights';
import useResizeHandler from './useResizeHandler';
import useRoleModel from './useRoleModel';
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
	useThreeCore(containerRef, { width, height });

	useGround({
		options: { width, height }
	});

	const control = useControl({});

	// 添加光照
	useLights();

	// 加载模型和动画
	const { animation } = useRoleModel(modelUrl);

	// 设置动画循环
	useAnimationLoop({
		animation,
		control
	});

	// 处理窗口大小变化
	useResizeHandler(width, height);

	return { animation };
};
