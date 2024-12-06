import { StardewValleyGirl } from 'briar-shared';

export const BRIAR_ICON =
	'http://static.stardew.site/%E8%B4%9D%E8%95%BE%E4%BA%9A%E4%B8%8A%E8%BA%AB64.png';

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
	[CursorEnum.Auto]: 'http://static.stardew.site/Watanabe%20Yuuya%20normal_page_01.png',
	[CursorEnum.Default]: 'http://static.stardew.site/Watanabe%20Yuuya%20normal_page_01.png',
	[CursorEnum.Cursor]: 'http://static.stardew.site/Watanabe%20Yuuya%20help_page_01.png',
	[CursorEnum.Grab]: 'http://static.stardew.site/Watanabe%20Yuuya%20hand_page_01.png',
	[CursorEnum.Text]: 'http://static.stardew.site/Watanabe%20Yuuya%20text_page_01.png',
	[CursorEnum.Help]: 'http://static.stardew.site/Watanabe%20Yuuya%20help_page_01.png',
	[CursorEnum.Progress]: 'http://static.stardew.site/Watanabe%20Yuuya%20work_page_04.png',
	[CursorEnum.Pointer]: 'http://static.stardew.site/Watanabe%20Yuuya%20link_page_01.png'
};

export const STARDEW_VALLEY_GRIL = {
	[StardewValleyGirl.Abigail]: 'http://static.stardew.site/Abigail.png',
	[StardewValleyGirl.Caroline]: 'http://static.stardew.site/Caroline.png',
	[StardewValleyGirl.Emily]: 'http://static.stardew.site/Emily.png',
	[StardewValleyGirl.Haley]: 'http://static.stardew.site/Haley.png',
	[StardewValleyGirl.Penny]: 'http://static.stardew.site/Penny.png',
	[StardewValleyGirl.Robin]: 'http://static.stardew.site/Robin.png'
};
