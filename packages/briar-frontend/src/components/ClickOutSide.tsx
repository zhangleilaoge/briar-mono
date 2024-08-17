import React, { useRef, useEffect } from "react"

function ClickOutside({
  onClickOutside,
  children,
  ...props
}: {
  onClickOutside: () => void
  children: React.ReactNode
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        onClickOutside() // 触发回调
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClickOutside])

  return (
    <div ref={wrapperRef} {...props}>
      {children}
    </div>
  )
}

export default ClickOutside
