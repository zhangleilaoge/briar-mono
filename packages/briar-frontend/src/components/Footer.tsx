import { Footer as AntdFooter } from "antd/es/layout/layout"
import s from "@/styles/main.module.scss"

const Footer = () => {
  return (
    <AntdFooter className={s.Footer}>
      <div> Briar ©{new Date().getFullYear()} Created by zhangleilaoge</div>
      <a href="https://beian.miit.gov.cn" target="_blank">
        浙ICP备2024116093号
      </a>
    </AntdFooter>
  )
}

export default Footer
