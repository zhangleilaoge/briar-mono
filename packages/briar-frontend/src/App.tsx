import { Route, Routes } from "react-router-dom"
import s from "./styles/main.module.scss"
import { ConfigProvider, Menu, Spin } from "antd"
import { Header } from "antd/es/layout/layout"
import { BRIAR_ICON } from "./constants/img"
import { Suspense } from "react"
import { MENU_ROUTER_CONFIG, MenuKeyEnum } from "./constants/router"
import { getRoutes } from "./utils/router"
import { ThemeColor } from "./constants/styles"
import useLevelPath from "./hooks/useLevelPath"
import CompositionApiIntro from "./pages/tools/pages/composition-style-intro"

function App() {
  const { menuKey, onLevelPathChange } = useLevelPath()

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerBg: "#fff",
          },
          Menu: {
            itemSelectedColor: ThemeColor.selectedColor,
            colorText: ThemeColor.textColor,
            itemSelectedBg: ThemeColor.selectedBgColor,
            itemActiveBg: ThemeColor.selectedBgColor,
            horizontalItemSelectedColor: ThemeColor.selectedColor,
          },
          Spin: {
            colorPrimary: ThemeColor.selectedColor,
          },
          Radio: {
            colorPrimary: ThemeColor.selectedColor,
            colorPrimaryHover: ThemeColor.selectedColor,
            buttonColor: ThemeColor.textColor,
          },
          Button: {
            defaultColor: ThemeColor.textColor,
            defaultActiveColor: ThemeColor.selectedColor,
            defaultActiveBorderColor: ThemeColor.selectedColor,
            defaultActiveBg: ThemeColor.selectedBgColor,
            defaultHoverColor: ThemeColor.selectedColor,
            defaultHoverBorderColor: ThemeColor.selectedColor,
          },
          Select: {
            colorText: ThemeColor.textColor,
            optionSelectedBg: ThemeColor.selectedBgColor,
            colorPrimaryHover: ThemeColor.selectedColor,
            colorPrimary: ThemeColor.selectedColor,
          },
          Input: {
            colorText: ThemeColor.textColor,
            colorPrimary: ThemeColor.selectedColor,
            colorPrimaryHover: ThemeColor.selectedColor,
            activeShadow: `0 0 0 2px ${ThemeColor.selectedColor}1a`,
          },
        },
      }}
    >
      <Header className={s.Header}>
        <img src={BRIAR_ICON} className={s.Briar} />
        <Menu
          mode="horizontal"
          selectedKeys={[menuKey]}
          items={MENU_ROUTER_CONFIG}
          onClick={({ key }) => onLevelPathChange(key as MenuKeyEnum)}
          className={s.Menu}
          theme={"light"}
        />
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
          <Route path="/404" Component={CompositionApiIntro} />
        </Routes>
      </Suspense>
    </ConfigProvider>
  )
}

export default App
