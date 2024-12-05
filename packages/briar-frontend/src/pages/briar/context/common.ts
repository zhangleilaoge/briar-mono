import { IUserInfoDTO } from 'briar-shared';
import React, { Ref } from 'react';

const CommonContext = React.createContext({
	/** 用户 */
	userInfo: {} as IUserInfoDTO,
	availablePage: [] as string[],
	logout: () => {},

	fullRef: { current: null } as Ref<HTMLDivElement>,
	enterFullscreen: () => {},
	exitFullscreen: () => {},
	toggleFullscreen: () => {}
});

export default CommonContext;
