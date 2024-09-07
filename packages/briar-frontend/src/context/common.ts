import { IUserInfoDTO } from 'briar-shared';
import React from 'react';

// 创建一个新的 Context
const CommonContext = React.createContext({
	/** 全屏 */
	fullScreenInfo: {
		fullScreen: false,
		SiderClass: '',
		LayoutClass: ''
	},
	inFullScreen: () => {},
	outFullScreen: () => {},
	/** 用户 */
	userInfo: {} as IUserInfoDTO
});

export default CommonContext;
