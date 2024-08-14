import { Layout, Menu, theme } from "antd"
import Sider from "antd/es/layout/Sider"
import { useState } from "react"
import useConversationList from "./hooks/useConversationList"
import mainStyle from "@/styles/main.module.scss"
import { Content } from "antd/es/layout/layout"
import Footer from "@/components/Footer"
import Conversation from "./components/conversation"
import ConversationContext from "./context/conversation"
function CodeConverter() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const [collapsed, setCollapsed] = useState(false)
  const {
    menuConfig,
    currentConversationKey,
    clickMenuItem,
    updateConversation,
    addConversation,
    currentConversation,
    setCurrentConversationKey,
  } = useConversationList()

  return (
    <ConversationContext.Provider
      value={{
        updateConversation,
        addConversation,
        currentConversation,
        setCurrentConversationKey,
      }}
    >
      <Layout>
        <Sider
          width={240}
          collapsible
          className={mainStyle.Sider}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            mode="inline"
            selectedKeys={[currentConversationKey].filter(Boolean) as string[]}
            defaultOpenKeys={[]}
            items={menuConfig}
            className={mainStyle.SiderMenu}
            onClick={({ key }) => clickMenuItem(key)}
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
            <Conversation />
          </Content>
          <Footer />
        </div>
      </Layout>
    </ConversationContext.Provider>
  )
}

export default CodeConverter
