import { IConversation, RoleEnum } from "briar-shared"
import { FC } from "react"
import s from "./style.module.scss"
import { RobotOutlined } from "@ant-design/icons"
import useLoadingDesc from "./hooks/useLoadingDesc"

const Message: FC<{
  content: string
  role: RoleEnum
}> = ({ content, role }) => {
  const isUser = role === RoleEnum.User

  return (
    <div className={`${s.Message} ${isUser ? s.User : s.Assistant}`}>
      {!isUser && <RobotOutlined className={s.Profile} />}
      <div className={`${s.Content}`}>{content || " "}</div>
    </div>
  )
}

const Messages: FC<{
  conversation?: IConversation
  loading?: boolean
}> = ({ conversation, loading }) => {
  const { desc } = useLoadingDesc()
  const messages = conversation?.messages || []
  return (
    <>
      {messages.map((message, index) => {
        if (index === messages.length - 1 && loading && !message.content) {
          return (
            <Message key={message.created} content={desc} role={message.role} />
          )
        }
        return (
          <Message
            key={message.created}
            content={message.content}
            role={message.role}
          />
        )
      })}
    </>
  )
}

export default Messages
