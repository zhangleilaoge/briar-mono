import { CarOutlined, ExperimentOutlined, InteractionOutlined } from '@ant-design/icons';
import { lazy, LazyExoticComponent } from 'react';

import CompositionApiIntro from '@/pages/briar/pages/tools/pages/composition-style-intro';
import { IMenuRouterConfig } from '@/pages/briar/types/router';

export enum MenuKeyEnum {
	Tools = 'tools',
	Ai = 'ai'
}

export enum ToolsPathKeyEnum {
	CodeConverter = 'code-converter',
	CompositionStyleConverter = 'composition-style-converter',
	CompositionStyleIntro = 'composition-style-intro',
	Playground = 'playground',
	Shader = 'shader',
	Pragmatic = 'pragmatic',
	CommuteCalculator = 'commute-calculator'
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
	}
];

export const SIDER_MENU_ROUTER_CONFIG: IMenuRouterConfig[] = [
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
	},
	{
		key: ToolsPathKeyEnum.Pragmatic,
		label: '日常便利',
		icon: <CarOutlined />,
		children: [
			{
				key: ToolsPathKeyEnum.CommuteCalculator,
				label: '通勤计算器',
				component: lazy(() => import('../pages/tools/pages/commute-calculator'))
			}
		]
	}
];
