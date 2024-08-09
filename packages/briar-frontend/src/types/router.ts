export interface IMenuRouterConfig {
  key: string
  label: string
  component?: React.LazyExoticComponent<() => JSX.Element> | (() => JSX.Element)
  icon?: React.ReactNode
  children?: IMenuRouterConfig[]
}
