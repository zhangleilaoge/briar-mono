import { BarChartOutlined, ExperimentOutlined, InteractionOutlined } from '@ant-design/icons';
import { lazy, LazyExoticComponent } from 'react';

import CompositionApiIntro from '@/pages/tools/pages/composition-style-intro';
import { IMenuRouterConfig } from '@/types/router';

export enum MenuKeyEnum {
	Tools = 'tools',
	Ai = 'ai',
	Settings = 'settings'
}

export enum ToolsPathKeyEnum {
	CodeConverter = 'code-converter',
	CompositionStyleConverter = 'composition-style-converter',
	CompositionStyleIntro = 'composition-style-intro',
	Playground = 'playground',
	Shader = 'shader'
}

export enum SettingsPathKeyEnum {
	Manager = 'manager',
	Profile = 'profile',
	Dosage = 'dosage'
}

export const MENU_ROUTER_CONFIG: IMenuRouterConfig[] = [
	{
		key: MenuKeyEnum.Ai,
		label: 'AI',
		component: lazy(() => import('../pages/ai')) as LazyExoticComponent<() => JSX.Element>
	},
	{
		key: MenuKeyEnum.Tools,
		label: '工具',
		component: lazy(() => import('../pages/tools'))
	},
	{
		key: MenuKeyEnum.Settings,
		label: '设置',
		component: lazy(() => import('../pages/settings')),
		hide: true
	}
];

export const TOOLS_ROUTER_CONFIG: IMenuRouterConfig[] = [
	{
		key: ToolsPathKeyEnum.CodeConverter,
		label: '代码转换',
		icon: <InteractionOutlined />,
		children: [
			{
				key: ToolsPathKeyEnum.CompositionStyleIntro,
				label: 'composition-api转换介绍',
				component: CompositionApiIntro
			},
			{
				key: ToolsPathKeyEnum.CompositionStyleConverter,
				label: 'composition-api转换器',
				component: lazy(() => import('../pages/tools/pages/composition-style-converter'))
			}
		]
	},
	{
		key: ToolsPathKeyEnum.Playground,
		label: 'Playground',
		icon: <ExperimentOutlined />,
		children: [
			{
				key: ToolsPathKeyEnum.Shader,
				label: 'shader',
				component: lazy(() => import('../pages/tools/pages/shader'))
			}
		]
	}
];

export const SETTINGS_ROUTER_CONFIG: IMenuRouterConfig[] = [
	{
		key: SettingsPathKeyEnum.Manager,
		label: '管理',
		icon: <BarChartOutlined />,
		children: [
			{
				key: SettingsPathKeyEnum.Dosage,
				label: 'dosage',
				component: lazy(() => import('../pages/settings/pages/dosage'))
			}
		]
	}
];
