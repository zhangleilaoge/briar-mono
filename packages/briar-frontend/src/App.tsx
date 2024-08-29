import { Route, Routes } from "react-router-dom"
import s from "./styles/main.module.scss"
import { ConfigProvider, Menu, Spin } from "antd"
import { Header } from "antd/es/layout/layout"
import { BRIAR_ICON } from "./constants/img"
import { Suspense } from "react"
import { MENU_ROUTER_CONFIG, MenuKeyEnum } from "./constants/router"
import { getRoutes } from "./utils/router"
import useLevelPath from "./hooks/useLevelPath"
import CompositionApiIntro from "./pages/tools/pages/composition-style-intro"
import CommonContext from "./context/common"
import { THEME } from "./constants/styles"
import useFullScreen from "./hooks/useFullScreen"
import FloatBtn from "./components/FloatBtn"

import useLogin from "./hooks/useLogin"
import Profile from "./components/profile"

function App() {
  const { menuKey, onLevelPathChange } = useLevelPath()
  const {
    fullScreen,
    HeaderClass,
    SiderClass,
    LayoutClass,
    inFullScreen,
    outFullScreen,
  } = useFullScreen()
  const { profileImg, fullName } = useLogin()

  return (
    <ConfigProvider theme={THEME}>
      <CommonContext.Provider
        value={{
          fullScreen,
          SiderClass,
          LayoutClass,
          inFullScreen,
          outFullScreen,
          profileImg,
          fullName,
        }}
      >
        <FloatBtn />
        <Header className={HeaderClass}>
          <img src={BRIAR_ICON} className={s.Briar} />
          <div className={s.HeaderRight}>
            <Menu
              mode="horizontal"
              selectedKeys={[menuKey]}
              items={MENU_ROUTER_CONFIG}
              onClick={({ key }) => onLevelPathChange(key as MenuKeyEnum)}
              className={s.Menu}
              theme={"light"}
            />
            <Profile />
          </div>
        </Header>
        <Suspense
          fallback={
            <div className={s.SuspenseSpin}>
              <Spin size="large" />
            </div>
          }
        >
          <Routes>
            {getRoutes(MENU_ROUTER_CONFIG, MenuKeyEnum.Tools)}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
            {/* Fix me */}
            <Route path="/404" Component={CompositionApiIntro} />
          </Routes>
        </Suspense>
      </CommonContext.Provider>
    </ConfigProvider>
  )
}

export default App
