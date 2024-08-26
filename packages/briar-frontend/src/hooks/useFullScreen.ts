import { getUrlParams } from "@/utils/url"
import s from "@/styles/main.module.scss"
import { useEffect, useMemo, useState } from "react"
const useFullScreen = () => {
  const [fullScreen, setFullScreen] = useState(false)

  useEffect(() => {
    const { displayMode } = getUrlParams()
    setFullScreen(displayMode === "full")
  }, [location.search])

  const HeaderClass = useMemo(() => {
    return `${s.Header} ${fullScreen ? s.Hide : ""}`
  }, [fullScreen])

  const SiderClass = useMemo(() => {
    return `${s.Sider} ${fullScreen ? s.Hide : ""}`
  }, [fullScreen])

  const LayoutClass = useMemo(() => {
    return `${s.ContentLayout} ${fullScreen ? s.FullScreenContentLayout : ""}`
  }, [fullScreen])

  return { fullScreen, HeaderClass, SiderClass, LayoutClass }
}

export default useFullScreen
