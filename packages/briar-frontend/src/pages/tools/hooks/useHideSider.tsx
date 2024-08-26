import useShapeEle from "@/hooks/useShapeEle"
import mainStyle from "@/styles/main.module.scss"
import { useEffect } from "react"
const useHideSider = () => {
  const { shape: hide, reset: show } = useShapeEle({
    selectors: ["aside", "header"],
    targetStyle: {
      display: "none",
    },
  })
  const { shape: fill, reset: unFill } = useShapeEle({
    selectors: ["." + mainStyle.ContentLayout],
    targetStyle: {
      margin: "0",
      padding: "0",
      borderRadius: "0",
    },
  })

  useEffect(() => {
    hide()
    fill()

    return () => {
      show()
      unFill()
    }
  }, [fill, hide, show, unFill])
}

export default useHideSider
