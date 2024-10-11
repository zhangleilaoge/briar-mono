import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useContext } from 'react';

import CommonContext from '@/pages/briar/context/common';
import s from '@/pages/briar/styles/main.module.scss';
const FloatBtn = () => {
	const { inFullScreen, outFullScreen, fullScreenInfo } = useContext(CommonContext);
	return (
		<FloatButton.Group shape="circle">
			{fullScreenInfo.fullScreen ? (
				<FloatButton
					icon={<FullscreenExitOutlined />}
					className={s.ColoredText}
					onClick={outFullScreen}
				/>
			) : (
				<FloatButton
					icon={<FullscreenOutlined />}
					className={s.ColoredText}
					onClick={inFullScreen}
				/>
			)}
		</FloatButton.Group>
	);
};

export default FloatBtn;
