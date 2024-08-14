import { Layout, Menu, theme } from "antd"
import Sider from "antd/es/layout/Sider"
import useConversationList from "./hooks/useConversationList"
import mainStyle from "@/styles/main.module.scss"
import { Content } from "antd/es/layout/layout"
import Footer from "@/components/Footer"
import Conversation from "./components/conversation"
import ConversationContext from "./context/conversation"
import useSider from "@/hooks/useSider"
function CodeConverter() {
  const {
    token: { borderRadiusLG },
  } = theme.useToken()
  const { isCollapsed, setIsCollapsed } = useSider()
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
          collapsed={isCollapsed}
          onCollapse={(value) => setIsCollapsed(value)}
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
              background: "#efeaed",
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
