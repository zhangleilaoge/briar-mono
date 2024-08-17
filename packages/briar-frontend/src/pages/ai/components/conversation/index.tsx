import { Button, Popover, Radio, Select } from "antd"
import s from "./style.module.scss"
import { ArrowUpOutlined, FormOutlined, XFilled } from "@ant-design/icons"
import { FC, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ModelEnum, RoleEnum } from "briar-shared"
import ConversationContext from "../../context/conversation"
import Messages from "../messages"
import { chatRequestStream } from "@/api/ai"

import { useSSE } from "alova/client"
import useScroll from "../../hooks/useScroll"
import TextArea from "antd/es/input/TextArea"
import { SSEHookReadyState } from "../../constants"

interface IProps {}

const Conversation: FC<IProps> = () => {
  const [model, setModel] = useState<ModelEnum>(ModelEnum.Gpt4oMini)
  const [inputValue, setInputValue] = useState("")
  const {
    updateConversation,
    addConversation,
    setCurrentConversationKey,
    currentConversation,
  } = useContext(ConversationContext)
  const assistantAnswerRef = useRef("")
  const createNewChat = () => {
    setCurrentConversationKey(undefined)
  }

  const { onMessage, send, close, readyState } = useSSE(chatRequestStream)
  const loading = useMemo(() => {
    return (readyState as number) !== SSEHookReadyState.CLOSED
  }, [readyState])
  const { scrollToBottom } = useScroll(`.${s.Messages}`)

  onMessage(({ data }) => {
    if (!currentConversation) return

    assistantAnswerRef.current = `${assistantAnswerRef.current}${data}`

    updateConversation({
      ...currentConversation,
      messages: currentConversation?.messages.map((message, index) => {
        if (index === currentConversation?.messages.length - 1) {
          return {
            ...message,
            content: assistantAnswerRef.current,
            created: Date.now(),
          }
        }
        return message
      }),
    })

    scrollToBottom()
  })

  const submit = async () => {
    if (!inputValue || loading) {
      shutDown()
      return
    }

    const submitTime = Date.now()

    const submitMessage = {
      role: RoleEnum.User,
      content: inputValue,
      created: submitTime,
    }

    send({
      messages: JSON.stringify(
        (currentConversation?.messages || []).concat(submitMessage)
      ),
      model,
    })

    const userMessage = {
      role: RoleEnum.User,
      content: inputValue,
      created: submitTime,
    }

    const assistantMessage = {
      role: RoleEnum.Assistant,
      content: "",
      created: submitTime + 1,
    }

    if (currentConversation) {
      updateConversation({
        ...currentConversation,
        messages: [
          ...currentConversation.messages,
          userMessage,
          assistantMessage,
        ],
      })
    } else {
      addConversation({
        model,
        created: submitTime,
        messages: [userMessage, assistantMessage],
      })
    }

    setInputValue("")
  }

  const textareaPlaceholder = useMemo(() => {
    if (!currentConversation) {
      return "输入聊天内容，开启新的对话。"
    }

    return "继续输入内容以获取回答。"
  }, [currentConversation])

  const onTextAreaKeydown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const shutDown = () => {
    close()
    assistantAnswerRef.current = ""
    setInputValue("")
    scrollToBottom()
  }

  // sse 结束，手动关闭 stream
  useEffect(() => {
    if (!loading) {
      shutDown()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversation?.created, loading])

  return (
    <div className={s.Container}>
      <div className={s.Head}>
        <Popover content="创建新对话">
          <Radio.Group value={!currentConversation}>
            <Radio.Button onClick={createNewChat} value={true}>
              <FormOutlined />
            </Radio.Button>
          </Radio.Group>
        </Popover>
        <Select
          value={ModelEnum.Gpt4oMini}
          style={{ width: 120 }}
          onChange={setModel}
          options={[
            { value: ModelEnum.Gpt4oMini, label: ModelEnum.Gpt4oMini },
            {
              value: ModelEnum.Gpt4o,
              label: ModelEnum.Gpt4o,
            },
          ]}
        />
      </div>
      <div className={s.Messages}>
        <Messages conversation={currentConversation} />
      </div>
      <div className={s.Input}>
        <TextArea
          placeholder={textareaPlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          size="large"
          autoSize={{ minRows: 1, maxRows: 6 }}
          onKeyDown={onTextAreaKeydown}
        />
        <Button
          icon={loading ? <XFilled /> : <ArrowUpOutlined />}
          onClick={submit}
          className={s.SubmitBtn}
          shape="circle"
          danger={loading}
        ></Button>
      </div>
    </div>
  )
}

export default Conversation
