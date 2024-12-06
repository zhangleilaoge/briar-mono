import { IUserInfoDTO } from 'briar-shared';
import React, { Ref } from 'react';

const CommonContext = React.createContext({
	/** 用户 */
	userInfo: {} as IUserInfoDTO,
	availablePage: [] as string[],
	logout: () => {},

	/** 全屏 */
	fullRef: { current: null } as Ref<HTMLDivElement>,
	enterFullscreen: () => {},
	exitFullscreen: () => {},
	toggleFullscreen: () => {}
});

export default CommonContext;
