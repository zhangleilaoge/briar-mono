import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons"
import { FloatButton } from "antd"
import s from "@/styles/main.module.scss"
import CommonContext from "@/context/common"
import { useContext } from "react"
const FloatBtn = () => {
  const { inFullScreen, outFullScreen, fullScreen } = useContext(CommonContext)
  return (
    <FloatButton.Group shape="circle">
      {fullScreen ? (
        <FloatButton
          icon={<FullscreenExitOutlined />}
          className={s.ColoredText}
          onClick={outFullScreen}
        />
      ) : (
        <FloatButton
          icon={<FullscreenOutlined />}
          className={s.ColoredText}
          onClick={inFullScreen}
        />
      )}
    </FloatButton.Group>
  )
}

export default FloatBtn
