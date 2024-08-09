import { Routes } from "react-router-dom"
import { Menu, theme } from "antd"
import s from "./style.module.scss"
import { Content } from "antd/es/layout/layout"
import Footer from "@/components/Footer"
import { SIDER_MENU_ROUTER_CONFIG, ToolsPathKeyEnum } from "@/constants/router"
import useLevelPath from "@/hooks/useLevelPath"
import { findSuperiorRouterConfig, getRoutes } from "@/utils/router"
import { useMemo } from "react"

function CodeConverter() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const { menuKey, onLevelPathChange } = useLevelPath(2)

  const defaultOpenKeys = useMemo(() => {
    return findSuperiorRouterConfig(menuKey, SIDER_MENU_ROUTER_CONFIG)
  }, [menuKey])

  return (
    <>
      <div className={s.Sider}>
        <Menu
          mode="inline"
          selectedKeys={[menuKey]}
          defaultOpenKeys={defaultOpenKeys}
          className={s.SiderMenu}
          items={SIDER_MENU_ROUTER_CONFIG}
          onClick={({ key }) => onLevelPathChange(key)}
        />
      </div>
      <div className={s.ContentLayout}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            {getRoutes(
              SIDER_MENU_ROUTER_CONFIG,
              ToolsPathKeyEnum.CompositionStyleConverter
            )}
          </Routes>
        </Content>
        <Footer />
      </div>
    </>
  )
}

export default CodeConverter
