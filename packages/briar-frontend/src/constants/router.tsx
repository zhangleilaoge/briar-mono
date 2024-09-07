import CompositionApiIntro from '@/pages/tools/pages/composition-style-intro';
import { IMenuRouterConfig } from '@/types/router';
import { ExperimentOutlined, InteractionOutlined } from '@ant-design/icons';
import { lazy } from 'react';

export enum MenuKeyEnum {
	Tools = 'tools',
	Ai = 'ai'
}

export enum ToolsPathKeyEnum {
	CodeConverter = 'code-converter',
	CompositionStyleConverter = 'composition-style-converter',
	CompositionStyleIntro = 'composition-style-intro',
	Playground = 'playground',
	Shader = 'shader'
}

export const MENU_ROUTER_CONFIG: IMenuRouterConfig[] = [
	{
		key: MenuKeyEnum.Ai,
		label: 'AI',
		component: lazy(() => import('../pages/ai'))
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
	}
];
