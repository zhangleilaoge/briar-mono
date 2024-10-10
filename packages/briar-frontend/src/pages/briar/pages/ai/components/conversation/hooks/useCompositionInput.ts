import { useRef } from "react"

const useCompositionInput = () => {
  const isCompositionRef = useRef(false)

  const handleComposition = (ev: InputEvent) => {
    if (ev.type === "compositionend") {
      isCompositionRef.current = false
    } else {
      isCompositionRef.current = true
    }
  }

  return {
    handleComposition,
    isCompositionRef,
  }
}

export default useCompositionInput
