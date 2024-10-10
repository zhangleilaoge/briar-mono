import { createContext, useContext } from 'react';

// 使用 container 封装 context，可以减少代码量(state 传递，context 定义)

export interface IContainerProviderProps<State = any> {
	initialState?: State;
}

export interface IConnectContainerItem<Value, State> extends IContainer<Value, State> {
	initialState?: State;
}

export type IContainerUseHook<State, Value> = (initialState?: State) => Value;

export interface IContainer<Value, State = any> {
	Provider: React.ComponentType<IContainerProviderProps<State>>;
	Context: React.Context<Value | null>;
	useContainer: () => Value;
	initialState?: State;
}

export function getDisplayName(WrappedComponent: React.ComponentType<any>) {
	return WrappedComponent.displayName || WrappedComponent.name || 'UnnamedComponent';
}

export function createContainer<Value, State>(
	useHook: IContainerUseHook<State, Value>,
	initialState?: State
): IContainer<Value, State> {
	const Context = createContext<Value | null>(null);

	const Provider: React.FC<IContainerProviderProps<State>> = (props) => {
		const value = useHook(props.initialState);
		// @ts-ignore
		return <Context.Provider value={value}>{props.children}</Context.Provider>;
	};

	function useContainer(): Value {
		const value = useContext(Context);
		if (value === null) {
			throw new Error('Component must be wrapped with <Container.Provider>');
		}
		return value;
	}

	return { Provider, Context, useContainer, initialState };
}

export function useContainer<Value, State = void>(container: IContainer<Value, State>): Value {
	return container.useContainer();
}

/**
 * 在 ReactComponent 外包裹多个 Container 的辅助方法
 */
export function connectContainers<AppProps>(containers: Array<IConnectContainerItem<any, any>>) {
	return (App: React.ComponentType<AppProps> & JSX.IntrinsicAttributes) => {
		const ConnectedComponent: React.FC<AppProps & JSX.IntrinsicAttributes> = (props) => {
			return containers.reduceRight(
				(Inner, Container) => {
					return (
						// @ts-ignore
						<Container.Provider initialState={Container.initialState}>{Inner}</Container.Provider>
					);
				},
				<App {...props} />
			);
		};

		ConnectedComponent.displayName = `ConnectedContainers(${getDisplayName(App)})`;

		return ConnectedComponent;
	};
}
