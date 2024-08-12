import { IConversation, RoleEnum } from "briar-shared"
import { FC } from "react"
import s from "./style.module.scss"
import { RobotOutlined } from "@ant-design/icons"

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
}> = ({ conversation }) => {
  const messages = conversation?.messages || []
  return (
    <>
      {messages.map((message) => {
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
