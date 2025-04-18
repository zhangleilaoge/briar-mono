// components/ThreeJSScene.tsx
import React from 'react';

import { useThreeScene } from './hooks/useThreeScene';

const width = 500;
const height = 500;
const modelUrl =
	'https://file.yzcdn.cn/upload_files/yz-file/2025/04/08/lsCNwrk1ZUtlezJe3e5G7b2Nl1_5.glb';

const ThreeJSScene = () => {
	const containerRef = React.useRef<HTMLDivElement>(null);

	useThreeScene(containerRef, {
		width,
		height,
		modelUrl
	});

	return (
		<div
			ref={containerRef}
			style={{
				width: `${width}px`,
				height: `${height}px`,
				backgroundColor: '#f0f0f0'
			}}
		/>
	);
};

export default ThreeJSScene;
