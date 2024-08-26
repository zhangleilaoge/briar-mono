import { safeJsonParse } from "briar-shared"
import { useCallback, useRef } from "react"

interface IUseShapeMenu {
  selectors: string[]
  targetStyle: Partial<CSSStyleDeclaration>
}

function useShapeEle({ selectors, targetStyle }: IUseShapeMenu) {
  const originStyleRef = useRef<Record<string, CSSStyleDeclaration>>({})

  const shape = useCallback(() => {
    selectors.forEach((selector) => {
      const element = document.querySelector(selector) as HTMLElement

      originStyleRef.current = {
        ...originStyleRef.current,
        [selector]: safeJsonParse(JSON.stringify(element.style)),
      }

      Object.keys(targetStyle).forEach((key: string) => {
        element.style[key as any] = targetStyle[key as any]!
      })
    })
  }, [selectors, targetStyle])

  const reset = useCallback(() => {
    selectors.forEach((selector) => {
      const element = document.querySelector(selector) as HTMLElement

      Object.keys(targetStyle).forEach((key: string) => {
        element.style[key as any] =
          originStyleRef.current[selector]?.[key as any] || ""
      })
    })
  }, [selectors, targetStyle])

  return { shape, reset }
}

export default useShapeEle
