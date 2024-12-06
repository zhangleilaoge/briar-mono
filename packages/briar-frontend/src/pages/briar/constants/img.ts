import { StardewValleyGirl } from 'briar-shared';

export const BRIAR_ICON =
	'https://static.stardew.site/%E8%B4%9D%E8%95%BE%E4%BA%9A%E4%B8%8A%E8%BA%AB64.png';

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
	[CursorEnum.Auto]: 'https://static.stardew.site/Watanabe%20Yuuya%20normal_page_01.png',
	[CursorEnum.Default]: 'https://static.stardew.site/Watanabe%20Yuuya%20normal_page_01.png',
	[CursorEnum.Cursor]: 'https://static.stardew.site/Watanabe%20Yuuya%20help_page_01.png',
	[CursorEnum.Grab]: 'https://static.stardew.site/Watanabe%20Yuuya%20hand_page_01.png',
	[CursorEnum.Text]: 'https://static.stardew.site/Watanabe%20Yuuya%20text_page_01.png',
	[CursorEnum.Help]: 'https://static.stardew.site/Watanabe%20Yuuya%20help_page_01.png',
	[CursorEnum.Progress]: 'https://static.stardew.site/Watanabe%20Yuuya%20work_page_04.png',
	[CursorEnum.Pointer]: 'https://static.stardew.site/Watanabe%20Yuuya%20link_page_01.png'
};

export const STARDEW_VALLEY_GRIL = {
	[StardewValleyGirl.Abigail]: 'https://static.stardew.site/Abigail.png',
	[StardewValleyGirl.Caroline]: 'https://static.stardew.site/Caroline.png',
	[StardewValleyGirl.Emily]: 'https://static.stardew.site/Emily.png',
	[StardewValleyGirl.Haley]: 'https://static.stardew.site/Haley.png',
	[StardewValleyGirl.Penny]: 'https://static.stardew.site/Penny.png',
	[StardewValleyGirl.Robin]: 'https://static.stardew.site/Robin.png'
};
