import {
	CarOutlined,
	ExperimentOutlined,
	FileImageOutlined,
	InteractionOutlined,
	ToolOutlined,
	UserOutlined
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
	Personal_1 = 'personal',

	CodeConverter_2 = 'code-converter',
	Pragmatic_2 = 'pragmatic',
	Utility_2 = 'utility',
	Playground_2 = 'playground',
	User_2 = 'user',
	Account_2 = 'account',
	Images_2 = 'images',

	CompositionStyleConverter_3 = 'composition-style-converter',
	CompositionStyleIntro_3 = 'composition-style-intro',
	Shader_3 = 'shader',
	CommuteCalculator_3 = 'commute-calculator',
	ShortUrl_3 = 'short-url',
	RoleList_3 = 'role-list',
	UserList_3 = 'user-list',
	Calculator_3 = 'calculator',
	JsonFormatter_3 = 'json-formatter',
	compressImg_3 = 'compress-img'
}

export const MENU_KEY_NAMES = {
	[MenuKeyEnum.Ai_1]: 'AI',
	[MenuKeyEnum.Tools_1]: '工具',
	[MenuKeyEnum.Admin_1]: '控制台',
	[MenuKeyEnum.Personal_1]: '个人中心',

	[MenuKeyEnum.CodeConverter_2]: '代码转换',
	[MenuKeyEnum.Pragmatic_2]: '日常便利',
	[MenuKeyEnum.Utility_2]: '实用工具',
	[MenuKeyEnum.Playground_2]: '实验室',
	[MenuKeyEnum.User_2]: '用户管理',
	[MenuKeyEnum.Account_2]: '账号管理',
	[MenuKeyEnum.Images_2]: '图片管理',

	[MenuKeyEnum.CompositionStyleConverter_3]: 'composition-api转换器',
	[MenuKeyEnum.CompositionStyleIntro_3]: 'composition-api转换介绍',
	[MenuKeyEnum.Shader_3]: 'shader',
	[MenuKeyEnum.CommuteCalculator_3]: '通勤计算器',
	[MenuKeyEnum.ShortUrl_3]: '短链工具',
	[MenuKeyEnum.RoleList_3]: '角色列表',
	[MenuKeyEnum.UserList_3]: '用户列表',
	[MenuKeyEnum.Calculator_3]: '计算器',
	[MenuKeyEnum.JsonFormatter_3]: 'JSON格式化校验',
	[MenuKeyEnum.compressImg_3]: '图片压缩'
};

export const DEFAULT_MENU_KEY = {
	[MenuKeyEnum.Briar_0]: MenuKeyEnum.Ai_1,
	[MenuKeyEnum.Tools_1]: MenuKeyEnum.CodeConverter_2,
	[MenuKeyEnum.Admin_1]: MenuKeyEnum.User_2,
	[MenuKeyEnum.Personal_1]: MenuKeyEnum.Account_2,
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
				key: MenuKeyEnum.Images_2,
				label: MENU_KEY_NAMES[MenuKeyEnum.Images_2],
				icon: <FileImageOutlined />,
				component: lazy(() => import('../pages/tools/pages/images'))
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
					},
					{
						key: MenuKeyEnum.Calculator_3,
						label: MENU_KEY_NAMES[MenuKeyEnum.Calculator_3],
						component: lazy(() => import('../pages/tools/pages/calculator'))
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
						key: MenuKeyEnum.JsonFormatter_3,
						label: MENU_KEY_NAMES[MenuKeyEnum.JsonFormatter_3],
						component: lazy(() => import('../pages/tools/pages/json-formatter'))
					},
					{
						key: MenuKeyEnum.compressImg_3,
						label: MENU_KEY_NAMES[MenuKeyEnum.compressImg_3],
						component: lazy(() => import('../pages/tools/pages/compress-img'))
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
	},
	{
		key: MenuKeyEnum.Personal_1,
		label: MENU_KEY_NAMES[MenuKeyEnum.Personal_1],
		component: lazy(() => import('../pages/personal')),
		hideInHeader: true,
		children: [
			{
				key: MenuKeyEnum.Account_2,
				label: MENU_KEY_NAMES[MenuKeyEnum.Account_2],
				icon: <UserOutlined />,
				component: lazy(() => import('../pages/personal/pages/account'))
			}
		]
	}
];
