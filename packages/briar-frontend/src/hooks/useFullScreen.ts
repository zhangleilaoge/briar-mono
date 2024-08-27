import { getUrlParams, QueryKeyEnum, updateURLParameter } from "@/utils/url"
import s from "@/styles/main.module.scss"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import useNeedUpdate from "./useNeedUpdate"
import { LocalStorageKey } from "@/constants/env"
const useFullScreen = () => {
  const [fullScreen, setFullScreen] = useState(false)
  const location = useLocation()
  const { needUpdate, triggerUpdate, finishUpdate } = useNeedUpdate()

  useEffect(() => {
    if (!needUpdate) {
      return
    }
    const {
      displayMode = localStorage.getItem(LocalStorageKey.FullScreen) || "",
    } = getUrlParams()
    setFullScreen(displayMode === "full")
    localStorage.setItem(LocalStorageKey.FullScreen, displayMode)
    finishUpdate()
  }, [finishUpdate, needUpdate])

  useEffect(() => {
    triggerUpdate()
  }, [location, triggerUpdate])

  const inFullScreen = useCallback(() => {
    updateURLParameter(QueryKeyEnum.displayMode)
    localStorage.setItem(LocalStorageKey.FullScreen, "full")
    triggerUpdate()
  }, [triggerUpdate])

  const outFullScreen = useCallback(() => {
    updateURLParameter(QueryKeyEnum.displayMode)
    localStorage.setItem(LocalStorageKey.FullScreen, "normal")
    triggerUpdate()
  }, [triggerUpdate])

  const HeaderClass = useMemo(() => {
    return `${s.Header} ${fullScreen ? s.Hide : ""}`
  }, [fullScreen])

  const SiderClass = useMemo(() => {
    return `${s.Sider} ${fullScreen ? s.Hide : ""}`
  }, [fullScreen])

  const LayoutClass = useMemo(() => {
    return `${s.ContentLayout} ${fullScreen ? s.FullScreenContentLayout : ""}`
  }, [fullScreen])

  return {
    fullScreen,
    inFullScreen,
    outFullScreen,
    HeaderClass,
    SiderClass,
    LayoutClass,
  }
}

export default useFullScreen
