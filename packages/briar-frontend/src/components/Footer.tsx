import { Footer as AntdFooter } from "antd/es/layout/layout"
import s from "@/styles/main.module.scss"

const Footer = () => {
  return (
    <AntdFooter className={s.Footer}>
      Briar ©{new Date().getFullYear()} Created by zhangleilaoge
    </AntdFooter>
  )
}

export default Footer
