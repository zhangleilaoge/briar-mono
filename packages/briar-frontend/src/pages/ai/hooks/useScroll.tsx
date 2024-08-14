import { useEffect, useState } from "react"

const useScroll = (querySelectorStr: string) => {
  const dom = document.querySelector(querySelectorStr) as HTMLDivElement
  const [isNearBottom, setIsNearBottom] = useState(false)

  const scrollToBottom = () => {
    setTimeout(() => {
      if (dom) {
        dom.scrollTop = dom.scrollHeight
      }
    }, 100)
  }

  useEffect(() => {
    if (dom) {
      dom.onscroll = () => {
        console.log(dom.scrollHeight, dom.scrollTop, dom.clientHeight)
        // 离底部一个父组件的高度，认为远离底部
        if (dom.scrollHeight - dom.scrollTop > 2 * dom.clientHeight) {
          setIsNearBottom(true)
        } else {
          setIsNearBottom(false)
        }
      }
    }
  }, [dom])

  return {
    scrollToBottom,
    isNearBottom,
  }
}

export default useScroll
