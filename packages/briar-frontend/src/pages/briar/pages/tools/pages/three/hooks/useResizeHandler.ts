import { useEffect } from 'react';

import { useContainer } from '@/pages/briar/hooks/useContainer';

import { threeContainer } from '../container';

const useResizeHandler = (width: number, height: number) => {
	const { camera, renderer } = useContainer(threeContainer);
	useEffect(() => {
		const handleResize = () => {
			if (camera && renderer) {
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				renderer.setSize(width, height);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [camera, renderer, width, height]);
};

export default useResizeHandler;
