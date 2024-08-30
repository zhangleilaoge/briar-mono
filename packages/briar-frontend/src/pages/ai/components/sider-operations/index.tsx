import {
  BarsOutlined,
  CloseCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import s from "./style.module.scss"
import { useContext } from "react"
import ConversationContext from "../../context/conversation"

const SiderOperations = ({
  setIsCollapsed,
  isCollapsed,
}: {
  setIsCollapsed: (isCollapsed: boolean) => void
  isCollapsed: boolean
}) => {
  const {
    multiSelectMode,
    inMultiSelectMode,
    outMultiSelectMode,
    deleteSelectedConversation,
  } = useContext(ConversationContext)
  return (
    <div className={s.SiderOperations}>
      <div className={multiSelectMode ? "" : s.hideBtn}>
        <Tooltip title={"全部删除"}>
          <Button
            icon={<CloseCircleOutlined />}
            size="small"
            type="text"
            className={s.btn}
            onClick={deleteSelectedConversation}
          ></Button>
        </Tooltip>
        <Tooltip title={"退出多选"}>
          <Button
            icon={<BarsOutlined />}
            size="small"
            type="text"
            className={s.btn}
            onClick={outMultiSelectMode}
          ></Button>
        </Tooltip>
      </div>
      <div className={multiSelectMode ? s.hideBtn : ""}>
        <Tooltip title={"多选"}>
          <Button
            icon={<BarsOutlined />}
            size="small"
            type="text"
            className={s.btn}
            onClick={inMultiSelectMode}
          ></Button>
        </Tooltip>
      </div>
      <Tooltip title={isCollapsed ? "展开" : "折叠"}>
        <Button
          icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          size="small"
          type="text"
          className={s.btn}
          onClick={() => setIsCollapsed(!isCollapsed)}
        ></Button>
      </Tooltip>
    </div>
  )
}

export default SiderOperations
