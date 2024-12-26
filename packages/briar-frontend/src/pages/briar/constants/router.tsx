import {
	// BulbOutlined,
	CarOutlined,
	CoffeeOutlined,
	ExperimentOutlined,
	FileImageOutlined,
	FireOutlined,
	InteractionOutlined,
	StarOutlined,
	ToolOutlined,
	UserOutlined
} from '@ant-design/icons';
import { t } from 'i18next';
import { lazy, LazyExoticComponent } from 'react';

import CompositionApiIntro from '@/pages/briar/pages/tools/pages/composition-style-intro';
import { IMenuRouterConfig } from '@/pages/briar/types/router';

import { TranslationEnum } from './locales/common';

/** 菜单路由 key，以层级作为后缀 */
export enum MenuKeyEnum {
	Briar_0 = 'briar',

	Tools_1 = 'tools',
	Ai_1 = 'ai',
	Admin_1 = 'admin',
	Personal_1 = 'personal',
	Blog_1 = 'blog',

	CodeConverter_2 = 'code-converter',
	Pragmatic_2 = 'pragmatic',
	Utility_2 = 'utility',
	Playground_2 = 'playground',
	User_2 = 'user',
	Account_2 = 'account',
	Images_2 = 'images',
	RecommendBlogPost_2 = 'recommend-blog-post',
	MyBlogPost_2 = 'my-blog-post',
	PostBlog_2 = 'post-blog',
	BlogDetail_2 = 'blog-detail',
	FavoriteBlog_2 = 'favorite-blog',

	CompositionStyleConverter_3 = 'composition-style-converter',
	CompositionStyleIntro_3 = 'composition-style-intro',
	Shader_3 = 'shader',
	CommuteCalculator_3 = 'commute-calculator',
	ShortUrl_3 = 'short-url',
	RoleList_3 = 'role-list',
	UserList_3 = 'user-list',
	Calculator_3 = 'calculator',
	JsonFormatter_3 = 'json-formatter',
	compressImg_3 = 'compress-img',
	DecodeEncode_3 = 'decode-encode'
}

/** @description 菜单名称，value 请勿使用 kebab case */
export const MENU_KEY_NAMES = {
	[MenuKeyEnum.Ai_1]: 'AI',
	[MenuKeyEnum.Tools_1]: t(TranslationEnum.Tools),
	[MenuKeyEnum.Admin_1]: t(TranslationEnum.Admin),
	[MenuKeyEnum.Personal_1]: t(TranslationEnum.PersonalHomepage),
	[MenuKeyEnum.Blog_1]: t(TranslationEnum.Blog),

	[MenuKeyEnum.CodeConverter_2]: t(TranslationEnum.CodeConverter),
	[MenuKeyEnum.Pragmatic_2]: t(TranslationEnum.Pragmatic),
	[MenuKeyEnum.Utility_2]: t(TranslationEnum.Utility),
	[MenuKeyEnum.Playground_2]: t(TranslationEnum.Playground),
	[MenuKeyEnum.User_2]: t(TranslationEnum.User),
	[MenuKeyEnum.Account_2]: t(TranslationEnum.Account),
	[MenuKeyEnum.Images_2]: t(TranslationEnum.Images),
	[MenuKeyEnum.RecommendBlogPost_2]: t(TranslationEnum.RecommendBlogPost),
	[MenuKeyEnum.MyBlogPost_2]: t(TranslationEnum.MyBlogPost),
	[MenuKeyEnum.PostBlog_2]: t(TranslationEnum.PostBlog),
	[MenuKeyEnum.BlogDetail_2]: t(TranslationEnum.BlogDetail),
	[MenuKeyEnum.FavoriteBlog_2]: t(TranslationEnum.FavoriteBlog),

	[MenuKeyEnum.CompositionStyleConverter_3]: t(TranslationEnum.CompositionStyleConverter),
	[MenuKeyEnum.CompositionStyleIntro_3]: t(TranslationEnum.CompositionApiIntro),
	[MenuKeyEnum.Shader_3]: 'shader',
	[MenuKeyEnum.CommuteCalculator_3]: t(TranslationEnum.CommuteCalculator),
	[MenuKeyEnum.ShortUrl_3]: t(TranslationEnum.ShortUrl),
	[MenuKeyEnum.RoleList_3]: t(TranslationEnum.RoleList),
	[MenuKeyEnum.UserList_3]: t(TranslationEnum.UserList),
	[MenuKeyEnum.Calculator_3]: t(TranslationEnum.Calculator),
	[MenuKeyEnum.JsonFormatter_3]: t(TranslationEnum.JsonFormatter),
	[MenuKeyEnum.compressImg_3]: t(TranslationEnum.compressImg),
	[MenuKeyEnum.DecodeEncode_3]: t(TranslationEnum.DecodeEncode)
};

export const DEFAULT_MENU_KEY = {
	[MenuKeyEnum.Briar_0]: MenuKeyEnum.Ai_1,
	[MenuKeyEnum.Tools_1]: MenuKeyEnum.CodeConverter_2,
	[MenuKeyEnum.Admin_1]: MenuKeyEnum.User_2,
	[MenuKeyEnum.Personal_1]: MenuKeyEnum.Account_2,
	[MenuKeyEnum.Blog_1]: MenuKeyEnum.RecommendBlogPost_2,
	[MenuKeyEnum.User_2]: MenuKeyEnum.RoleList_3,
	[MenuKeyEnum.CodeConverter_2]: MenuKeyEnum.CompositionStyleConverter_3
};

export const ROUTER_CONFIG: IMenuRouterConfig[] = [
	{
		key: MenuKeyEnum.Blog_1,
		label: MENU_KEY_NAMES[MenuKeyEnum.Blog_1],
		component: lazy(() => import('../pages/blog')) as LazyExoticComponent<() => JSX.Element>,
		children: [
			{
				icon: <FireOutlined />,
				key: MenuKeyEnum.RecommendBlogPost_2,
				label: MENU_KEY_NAMES[MenuKeyEnum.RecommendBlogPost_2],
				component: lazy(() => import('../pages/blog/pages/recommend-blog-post'))
			},
			// 没做完暂时给隐藏了
			// {
			// 	icon: <BulbOutlined />,
			// 	key: MenuKeyEnum.MyBlogPost_2,
			// 	label: MENU_KEY_NAMES[MenuKeyEnum.MyBlogPost_2],
			// 	component: lazy(() => import('../pages/blog/pages/my-blog-post'))
			// },
			{
				icon: <CoffeeOutlined />,
				key: MenuKeyEnum.PostBlog_2,
				label: MENU_KEY_NAMES[MenuKeyEnum.PostBlog_2],
				component: lazy(() => import('../pages/blog/pages/post-blog'))
			},
			{
				icon: <StarOutlined />,
				key: MenuKeyEnum.FavoriteBlog_2,
				label: MENU_KEY_NAMES[MenuKeyEnum.FavoriteBlog_2],
				component: lazy(() => import('../pages/blog/pages/favorite-blog'))
			},
			{
				key: MenuKeyEnum.BlogDetail_2,
				hideInNav: true,
				label: MENU_KEY_NAMES[MenuKeyEnum.BlogDetail_2],
				component: lazy(() => import('../pages/blog/pages/blog-detail'))
			}
		]
	},
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
					},
					{
						key: MenuKeyEnum.DecodeEncode_3,
						label: MENU_KEY_NAMES[MenuKeyEnum.DecodeEncode_3],
						component: lazy(() => import('../pages/tools/pages/decode-encode'))
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
		hideInNav: true,
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
		hideInNav: true,
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
