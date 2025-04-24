// components/ThreeJSScene.tsx
import { pick } from 'lodash-es';
import React from 'react';
import ReactJson from 'react-json-view';

import { connectContainers, useContainer } from '@/pages/briar/hooks/useContainer';

import { threeContainer } from './container';
import { useThree } from './hooks/useThree';

const width = 500;
const height = 500;
const modelUrl =
	'https://file.yzcdn.cn/upload_files/yz-file/2025/04/08/lsCNwrk1ZUtlezJe3e5G7b2Nl1_5.glb';

const ThreeJSScene = () => {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const { rolePosition, camera } = useContainer(threeContainer);

	useThree(containerRef, {
		width,
		height,
		modelUrl
	});

	const data = {
		cameraPosition: pick(camera?.position || {}, ['x', 'y', 'z']),
		roleModelPosition: rolePosition
	};

	return (
		<div className="flex">
			<div
				ref={containerRef}
				style={{
					width: `${width}px`,
					height: `${height}px`,
					backgroundColor: '#f0f0f0'
				}}
				className="mr-[12px]"
			/>
			<ReactJson src={data} collapsed={2} displayDataTypes={false} />
		</div>
	);
};

export default connectContainers([threeContainer])(ThreeJSScene);
