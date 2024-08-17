import { LocalStorageKey } from "@/constants/env"
import { safeJsonParse } from "briar-shared"
import { useEffect, useState } from "react"

const useSider = () => {
  const [isCollapsed, _setIsCollapsed] = useState(false)
  const [needUpdate, setNeedUpdate] = useState(false)

  useEffect(() => {
    const siderStatus =
      safeJsonParse(localStorage.getItem(LocalStorageKey.Sider) || "false") ||
      false

    _setIsCollapsed(siderStatus)
  }, [])

  useEffect(() => {
    if (!needUpdate) {
      return
    }
    localStorage.setItem(LocalStorageKey.Sider, JSON.stringify(isCollapsed))
    setNeedUpdate(false)
  }, [isCollapsed, needUpdate])

  const setIsCollapsed = (_isCollapsed: boolean) => {
    _setIsCollapsed(_isCollapsed)
    setNeedUpdate(true)
  }

  return { isCollapsed, setIsCollapsed }
}

export default useSider
