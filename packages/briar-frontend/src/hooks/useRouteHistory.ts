import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const useRouteHistory = () => {
  const location = useLocation()
  const [pathHistory, setPathHistory] = useState<string[]>([])

  useEffect(() => {
    const previousPathname = pathHistory?.[pathHistory.length - 1]
    console.log("previousPathname", previousPathname)

    setPathHistory((history) => {
      const previousPathname = history?.[history.length - 1]
      if (previousPathname === location.pathname) return history
      return [...history, location.pathname]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return {
    pathHistory,
  }
}

export default useRouteHistory
