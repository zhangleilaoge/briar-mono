import { Button, Dropdown, Input, InputRef, MenuProps, theme } from "antd"
import s from "./style.module.scss"
import { DeleteFilled, EditFilled, EllipsisOutlined } from "@ant-design/icons"
import { IConversation } from "briar-shared"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ClickOutside from "@/components/ClickOutSide"

enum OperationEnum {
  Edit = "edit",
  Delete = "delete",
}

export const MenuItem = ({
  conversation,
  deleteConversation,
  updateConversation,
}: {
  conversation: IConversation
  deleteConversation: (_: IConversation) => void
  updateConversation: (_: IConversation, updateToTop?: boolean) => void
}) => {
  const { messages, title } = conversation
  const inputRef = useRef<InputRef>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title || messages?.[0].content)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const conversationTitle = useMemo(() => {
    return title || messages?.[0].content
  }, [messages, title])
  const {
    token: { colorError },
  } = theme.useToken()

  const finishEdit = useCallback(() => {
    setIsEditing(false)
    updateConversation(
      {
        ...conversation,
        title: editValue || conversationTitle,
      },
      false
    )
  }, [conversation, conversationTitle, editValue, updateConversation])

  const items: MenuProps["items"] = [
    {
      key: OperationEnum.Edit,
      label: (
        <div
          className={s.DropdownItem}
          onClick={(e) => {
            setIsEditing(true)
            setTimeout(() => {
              inputRef.current?.focus()
            })
            setDropdownOpen(false)
            e.stopPropagation()
          }}
        >
          <EditFilled />
          rename
        </div>
      ),
    },
    {
      key: OperationEnum.Delete,
      label: (
        <div
          className={s.DropdownItem}
          style={{ color: colorError }}
          onClick={(e) => {
            deleteConversation(conversation)
            setDropdownOpen(false)
            e.stopPropagation()
          }}
        >
          <DeleteFilled />
          delete
        </div>
      ),
    },
  ]

  useEffect(() => {
    setEditValue(conversationTitle)
  }, [conversationTitle])

  return (
    <div className={s.Conversation}>
      {isEditing ? (
        <ClickOutside onClickOutside={finishEdit}>
          <Input
            onBlur={finishEdit}
            ref={inputRef}
            onChange={(e) => {
              setEditValue(e.target.value)
            }}
            value={editValue}
            onClick={(e) => e.stopPropagation()}
            onPressEnter={(e) => {
              e.stopPropagation()
              finishEdit()
            }}
          />
        </ClickOutside>
      ) : (
        conversationTitle
      )}
      <Dropdown
        menu={{ items }}
        placement="bottomLeft"
        trigger={["click"]}
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
      >
        <Button
          icon={<EllipsisOutlined className={s.EditConversation} />}
          // size="small"
          type="text"
          onClick={(e) => e.stopPropagation()}
        ></Button>
      </Dropdown>
    </div>
  )
}
