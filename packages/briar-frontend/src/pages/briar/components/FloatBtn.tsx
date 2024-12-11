import { DownOutlined, FullscreenOutlined, MoreOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import { FloatButton } from 'antd';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import CommonContext from '@/pages/briar/context/common';
import s from '@/pages/briar/styles/main.module.scss';

import { Language } from '../constants/env';
import { LANGUAGE_ICON } from '../constants/img';
const FloatBtn = () => {
	const [collapsed, { toggle }] = useBoolean(true);

	const { toggleFullscreen } = useContext(CommonContext);
	const { i18n } = useTranslation();
	const switchLanguage = useCallback(() => {
		i18n.changeLanguage(i18n.language === Language.Zh ? Language.En : Language.Zh);

		window.location.reload();
	}, [i18n]);
	return (
		<FloatButton.Group
			shape="circle"
			open={!collapsed}
			onOpenChange={toggle}
			trigger="click"
			icon={<MoreOutlined />}
			closeIcon={<DownOutlined />}
		>
			<FloatButton
				icon={<FullscreenOutlined />}
				className={s.ColoredText}
				onClick={toggleFullscreen}
			/>
			<FloatButton
				icon={<img src={LANGUAGE_ICON[i18n.language as Language]} className="scale-125" />}
				className={s.ColoredText}
				onClick={switchLanguage}
			/>
		</FloatButton.Group>
	);
};

export default FloatBtn;
