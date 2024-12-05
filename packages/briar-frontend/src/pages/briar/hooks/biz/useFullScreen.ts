import { useFullscreen } from 'ahooks';
import { useRef } from 'react';

const useFullScreen = () => {
	const fullRef = useRef(null);
	const [_isFullscreen, { enterFullscreen, exitFullscreen, toggleFullscreen }] =
		useFullscreen(fullRef);

	return {
		fullRef,
		enterFullscreen,
		exitFullscreen,
		toggleFullscreen
	};
};

export default useFullScreen;
