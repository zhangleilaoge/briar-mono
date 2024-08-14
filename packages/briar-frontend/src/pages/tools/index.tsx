import { Routes } from "react-router-dom"
import { Layout, Menu, theme } from "antd"
import mainStyle from "@/styles/main.module.scss"
import { Content } from "antd/es/layout/layout"
import Footer from "@/components/Footer"
import { SIDER_MENU_ROUTER_CONFIG, ToolsPathKeyEnum } from "@/constants/router"
import useLevelPath from "@/hooks/useLevelPath"
import { findSuperiorRouterConfig, getRoutes } from "@/utils/router"
import { useMemo, useState } from "react"
import Sider from "antd/es/layout/Sider"

function CodeConverter() {
  const [collapsed, setCollapsed] = useState(false)

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const { menuKey, onLevelPathChange } = useLevelPath(2)

  const defaultOpenKeys = useMemo(() => {
    return findSuperiorRouterConfig(menuKey, SIDER_MENU_ROUTER_CONFIG)
  }, [menuKey])

  return (
    <Layout>
      <Sider
        className={mainStyle.Sider}
        width={240}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          mode="inline"
          selectedKeys={[menuKey]}
          defaultOpenKeys={defaultOpenKeys}
          className={mainStyle.SiderMenu}
          items={SIDER_MENU_ROUTER_CONFIG}
          onClick={({ key }) => onLevelPathChange(key)}
        />
      </Sider>
      <div className={mainStyle.ContentLayout}>
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
    </Layout>
  )
}

export default CodeConverter
