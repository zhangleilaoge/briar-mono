import { MenuKeyEnum } from '../constants/router';

export interface IMenuRouterConfig<T extends string = MenuKeyEnum> {
	key: T;
	label: string | React.ReactNode;
	component?: React.LazyExoticComponent<() => JSX.Element | null> | (() => JSX.Element | null);
	icon?: React.ReactNode;
	children?: IMenuRouterConfig<T>[];
	hideInNav?: boolean;
}
