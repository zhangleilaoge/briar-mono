import { FullscreenOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useContext } from 'react';

import CommonContext from '@/pages/briar/context/common';
import s from '@/pages/briar/styles/main.module.scss';
const FloatBtn = () => {
	const { toggleFullscreen } = useContext(CommonContext);
	return (
		<FloatButton.Group shape="circle">
			<FloatButton
				icon={<FullscreenOutlined />}
				className={s.ColoredText}
				onClick={toggleFullscreen}
			/>
		</FloatButton.Group>
	);
};

export default FloatBtn;
