import { IConversation, RoleEnum } from "briar-shared"
import { FC, useEffect } from "react"
import s from "./style.module.scss"
import { CopyOutlined, RobotOutlined } from "@ant-design/icons"
import useLoadingDesc from "./hooks/useLoadingDesc"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/atom-one-dark.css"
import { copyToClipboard } from "@/utils/document"
import { Button, message } from "antd"
import ReactDOM from "react-dom"

const Message: FC<{
  content: string
  role: RoleEnum
}> = ({ content, role }) => {
  const isUser = role === RoleEnum.User

  // 复制代码功能
  useEffect(() => {
    const codeBlocks = document.querySelectorAll(`pre`)

    codeBlocks.forEach((block) => {
      let button = block.querySelector(`.${s.CopyButton}`)
      if (button) {
        return
      }
      button = document.createElement("div")
      button.className = s.CopyButton

      ReactDOM.render(
        <Button
          type="text"
          style={{
            color: "#c8c9cc",
          }}
          icon={<CopyOutlined />}
          onClick={async () => {
            await copyToClipboard(block.innerText)
            message.success("复制成功")
          }}
        ></Button>,
        button
      )

      block.appendChild(button)
    })

    return () => {
      codeBlocks.forEach((block) => {
        const button = block.querySelector(`.${s.CopyButton}`)
        if (button) {
          block.removeChild(button)
        }
      })
    }
  }, [content])

  return (
    <div className={`${s.Message} ${isUser ? s.User : s.Assistant}`}>
      {!isUser && <RobotOutlined className={s.Profile} />}
      <div className={`${s.Content}`}>
        <Markdown rehypePlugins={[rehypeHighlight]}>{content || " "}</Markdown>
      </div>
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
