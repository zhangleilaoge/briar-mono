import { useState, useEffect, useCallback, useRef } from "react"

// 定义等待描述的列表
const descriptions = [
  "正在研究量子力学的最优解",
  "正在解码外星人的信号",
  "正在调试时光机的启动程序",
  "正在训练超级计算机学习瑜伽",
  "正在寻找隐形的独角兽",
  "正在探测黑洞的秘密",
]

const useLoadingDesc = () => {
  const [_, setDesc] = useState("")
  const [dots, setDots] = useState(".")
  const descTimer = useRef(0)
  const dotsTimer = useRef(0)

  const updateDots = useCallback(() => {
    setDots((prevDots) => {
      if (prevDots.length === 3) return "."
      return prevDots + "."
    })

    dotsTimer.current = setTimeout(updateDots, 1000)
  }, [])

  const updateDesc = useCallback(() => {
    setDesc((prevDesc) => {
      const nextDescIndex =
        (descriptions.indexOf(prevDesc.replace(/\.{1,3}$/, "")) + 1) %
        descriptions.length
      return `${descriptions[nextDescIndex]}${dots}`
    })

    descTimer.current = setTimeout(updateDesc, 3000)
  }, [dots])

  useEffect(() => {
    updateDots()
    updateDesc()

    return () => {
      clearTimeout(descTimer.current)
      clearTimeout(dotsTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { desc: dots }
}

export default useLoadingDesc
