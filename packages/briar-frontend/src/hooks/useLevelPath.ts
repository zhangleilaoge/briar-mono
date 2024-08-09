import { getLevelPath } from "@/utils/router"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

// 请完成 根目录进入时的menu初始化
const useLevelPath = (level = 1) => {
  const [menuKey, setMenuKey] = useState(getLevelPath(level))
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onLevelPathChange = (key: string) => {
    setMenuKey(key)
    navigate(key)
  }

  useEffect(() => {
    setMenuKey(getLevelPath(level))
  }, [level, pathname])

  return {
    menuKey,
    onLevelPathChange,
  }
}

export default useLevelPath
