import { IConversation, RoleEnum } from "briar-shared"
import { FC, useEffect, useState } from "react"
import s from "./style.module.scss"
import {
  CheckCircleFilled,
  CopyOutlined,
  RobotOutlined,
} from "@ant-design/icons"
import useLoadingDesc from "./hooks/useLoadingDesc"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/atom-one-dark.css"
import { copyToClipboard } from "@/utils/document"
import { Button, message } from "antd"
import ReactDOM from "react-dom"
import { format } from "date-fns/format"

const CopyBtn = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="text"
      className={s.CopyBtn}
      icon={copied ? <CheckCircleFilled /> : <CopyOutlined />}
      onClick={async () => {
        await copyToClipboard(content)
        message.success("复制成功")
        setCopied(true)
      }}
      onMouseLeave={() => {
        setTimeout(() => {
          setCopied(false)
        }, 5000)
      }}
    ></Button>
  )
}

const Message: FC<{
  content: string
  role: RoleEnum
  date: number
}> = ({ content, role, date }) => {
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

      ReactDOM.render(<CopyBtn content={block.textContent || ""} />, button)

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
      <div>
        <div className={s.Date}>{format(date, "yyyy-MM-dd HH:mm:ss")}</div>
        <div className={`${s.Content}`}>
          {isUser ? (
            content || ""
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {content || " "}
            </Markdown>
          )}
        </div>
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
            <Message
              key={message.created}
              content={desc}
              role={message.role}
              date={message.created}
            />
          )
        }
        return (
          <Message
            key={message.created}
            content={message.content}
            role={message.role}
            date={message.created}
          />
        )
      })}
    </>
  )
}

export default Messages
