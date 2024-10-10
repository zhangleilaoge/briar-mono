import { useCallback, useState } from "react"

const useNeedUpdate = () => {
  const [needUpdate, set] = useState<number | undefined>()

  const triggerUpdate = useCallback(() => {
    set(Math.random())
  }, [])

  const finishUpdate = useCallback(() => {
    set(undefined)
  }, [])

  return { needUpdate, triggerUpdate, finishUpdate }
}

export default useNeedUpdate
