import { useFullscreen } from 'ahooks';
import { useRef } from 'react';

const useFullScreen = () => {
	const fullRef = useRef(null);
	const [_isFullscreen, { toggleFullscreen }] = useFullscreen(fullRef);

	return {
		fullRef,
		toggleFullscreen
	};
};

export default useFullScreen;
