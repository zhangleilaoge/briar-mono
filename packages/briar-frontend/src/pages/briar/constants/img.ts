import { StardewValleyGirl } from 'briar-shared';

import { Language } from './env';

export const BRIAR_ICON =
	'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/%E8%B4%9D%E8%95%BE%E4%BA%9A%E4%B8%8A%E8%BA%AB64.png';

export enum CursorEnum {
	Auto = 'auto',
	Default = 'default',
	Cursor = 'cursor',
	Grab = 'grab',
	Text = 'text',
	Help = 'help',
	Progress = 'progress',
	Pointer = 'pointer'
}

export const CURSORS: Record<CursorEnum, string> = {
	[CursorEnum.Auto]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Watanabe%20Yuuya%20normal_page_01.png',
	[CursorEnum.Default]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Watanabe%20Yuuya%20normal_page_01.png',
	[CursorEnum.Cursor]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Watanabe%20Yuuya%20help_page_01.png',
	[CursorEnum.Grab]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Watanabe%20Yuuya%20hand_page_01.png',
	[CursorEnum.Text]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Watanabe%20Yuuya%20text_page_01.png',
	[CursorEnum.Help]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Watanabe%20Yuuya%20help_page_01.png',
	[CursorEnum.Progress]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Watanabe%20Yuuya%20work_page_04.png',
	[CursorEnum.Pointer]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Watanabe%20Yuuya%20link_page_01.png'
};

export const STARDEW_VALLEY_GRIL = {
	[StardewValleyGirl.Abigail]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Abigail.png',
	[StardewValleyGirl.Caroline]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Caroline.png',
	[StardewValleyGirl.Emily]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Emily.png',
	[StardewValleyGirl.Haley]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Haley.png',
	[StardewValleyGirl.Penny]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Penny.png',
	[StardewValleyGirl.Robin]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Robin.png'
};

export const LANGUAGE_ICON = {
	[Language.Zh]:
		'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/%E4%B8%AD%E8%8B%B1%E6%96%872%20%E4%B8%AD%E6%96%87.svg',
	[Language.En]: 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/%E4%B8%AD%E8%8B%B1%E6%96%87%20%E8%8B%B1%E6%96%87.svg'
};
