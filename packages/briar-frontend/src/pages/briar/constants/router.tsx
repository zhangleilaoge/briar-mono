import {
	CarOutlined,
	ExperimentOutlined,
	InteractionOutlined,
	ToolOutlined
} from '@ant-design/icons';
import { lazy, LazyExoticComponent } from 'react';

import CompositionApiIntro from '@/pages/briar/pages/tools/pages/composition-style-intro';
import { IMenuRouterConfig } from '@/pages/briar/types/router';

/** 菜单路由 key，以层级作为后缀 */
export enum MenuKeyEnum {
	Briar_0 = 'briar',

	Tools_1 = 'tools',
	Ai_1 = 'ai',
	Admin_1 = 'admin',

	CodeConverter_2 = 'code-converter',
	Pragmatic_2 = 'pragmatic',
	Utility_2 = 'utility',
	Playground_2 = 'playground',
	User_2 = 'user',

	CompositionStyleConverter_3 = 'composition-style-converter',
	CompositionStyleIntro_3 = 'composition-style-intro',
	Shader_3 = 'shader',
	CommuteCalculator_3 = 'commute-calculator',
	ShortUrl_3 = 'short-url',
	ShortUrlList_3 = 'short-url-list',
	RoleList_3 = 'role-list',
	UserList_3 = 'user-list'
}

export const MENU_KEY_NAMES = {
	[MenuKeyEnum.Ai_1]: 'AI',
	[MenuKeyEnum.Tools_1]: '工具',
	[MenuKeyEnum.Admin_1]: '控制台',

	[MenuKeyEnum.CodeConverter_2]: '代码转换',
	[MenuKeyEnum.Pragmatic_2]: '日常便利',
	[MenuKeyEnum.Utility_2]: '实用工具',
	[MenuKeyEnum.Playground_2]: '实验室',
	[MenuKeyEnum.User_2]: '用户管理',

	[MenuKeyEnum.CompositionStyleConverter_3]: 'composition-api转换器',
	[MenuKeyEnum.CompositionStyleIntro_3]: 'composition-api转换介绍',
	[MenuKeyEnum.Shader_3]: 'shader',
	[MenuKeyEnum.CommuteCalculator_3]: '通勤计算器',
	[MenuKeyEnum.ShortUrl_3]: '短链生成',
	[MenuKeyEnum.ShortUrlList_3]: '短链查询',
	[MenuKeyEnum.RoleList_3]: '角色列表',
	[MenuKeyEnum.UserList_3]: '用户列表'
};

export const DEFAULT_MENU_KEY = {
	[MenuKeyEnum.Briar_0]: MenuKeyEnum.Ai_1,
	[MenuKeyEnum.Tools_1]: MenuKeyEnum.CodeConverter_2,
	[MenuKeyEnum.Admin_1]: MenuKeyEnum.User_2,
	[MenuKeyEnum.User_2]: MenuKeyEnum.RoleList_3,
	[MenuKeyEnum.CodeConverter_2]: MenuKeyEnum.CompositionStyleConverter_3
};

export const ROUTER_CONFIG: IMenuRouterConfig[] = [
	{
		key: MenuKeyEnum.Ai_1,
		label: MENU_KEY_NAMES[MenuKeyEnum.Ai_1],
		component: lazy(() => import('../pages/ai')) as LazyExoticComponent<() => JSX.Element>
	},
	{
		key: MenuKeyEnum.Tools_1,
		label: MENU_KEY_NAMES[MenuKeyEnum.Tools_1],
		component: lazy(() => import('../pages/tools')),
		children: [
			{
				key: MenuKeyEnum.CodeConverter_2,
				label: MENU_KEY_NAMES[MenuKeyEnum.CodeConverter_2],
				icon: <InteractionOutlined />,
				children: [
					{
						key: MenuKeyEnum.CompositionStyleIntro_3,
						label: MENU_KEY_NAMES[MenuKeyEnum.CompositionStyleIntro_3],
						component: CompositionApiIntro
					},
					{
						key: MenuKeyEnum.CompositionStyleConverter_3,
						label: MENU_KEY_NAMES[MenuKeyEnum.CompositionStyleConverter_3],
						component: lazy(() => import('../pages/tools/pages/composition-style-converter'))
					}
				]
			},
			{
				key: MenuKeyEnum.Pragmatic_2,
				label: MENU_KEY_NAMES[MenuKeyEnum.Pragmatic_2],
				icon: <CarOutlined />,
				children: [
					{
						key: MenuKeyEnum.CommuteCalculator_3,
						label: MENU_KEY_NAMES[MenuKeyEnum.CommuteCalculator_3],
						component: lazy(() => import('../pages/tools/pages/commute-calculator'))
					}
				]
			},
			{
				key: MenuKeyEnum.Utility_2,
				label: MENU_KEY_NAMES[MenuKeyEnum.Utility_2],
				icon: <ToolOutlined />,
				children: [
					{
						key: MenuKeyEnum.ShortUrl_3,
						label: MENU_KEY_NAMES[MenuKeyEnum.ShortUrl_3],
						component: lazy(() => import('../pages/tools/pages/short-url'))
					},
					{
						key: MenuKeyEnum.ShortUrlList_3,
						label: MENU_KEY_NAMES[MenuKeyEnum.ShortUrlList_3],
						component: lazy(() => import('../pages/tools/pages/short-url-list'))
					}
				]
			},
			{
				key: MenuKeyEnum.Playground_2,
				label: MENU_KEY_NAMES[MenuKeyEnum.Playground_2],
				icon: <ExperimentOutlined />,
				children: [
					{
						key: MenuKeyEnum.Shader_3,
						label: MENU_KEY_NAMES[MenuKeyEnum.Shader_3],
						component: lazy(() => import('../pages/tools/pages/shader'))
					}
				]
			}
		]
	},
	{
		key: MenuKeyEnum.Admin_1,
		label: MENU_KEY_NAMES[MenuKeyEnum.Admin_1],
		component: lazy(() => import('../pages/admin')),
		children: [
			{
				key: MenuKeyEnum.User_2,
				label: MENU_KEY_NAMES[MenuKeyEnum.User_2],
				icon: <ExperimentOutlined />,
				children: [
					{
						key: MenuKeyEnum.RoleList_3,
						label: MENU_KEY_NAMES[MenuKeyEnum.RoleList_3],
						component: lazy(() => import('../pages/admin/pages/role'))
					},
					{
						key: MenuKeyEnum.UserList_3,
						label: MENU_KEY_NAMES[MenuKeyEnum.UserList_3],
						component: lazy(() => import('../pages/admin/pages/user'))
					}
				]
			}
		]
	}
];
