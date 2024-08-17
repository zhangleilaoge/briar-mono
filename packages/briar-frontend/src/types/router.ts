export interface IMenuRouterConfig {
  key: string
  label: string | React.ReactNode
  component?: React.LazyExoticComponent<() => JSX.Element> | (() => JSX.Element)
  icon?: React.ReactNode
  children?: IMenuRouterConfig[]
}
