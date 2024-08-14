import { Button, Popover, Radio, Select } from "antd"
import s from "./style.module.scss"
import { ArrowUpOutlined, FormOutlined } from "@ant-design/icons"
import { FC, useContext, useEffect, useMemo, useState } from "react"
import { ModelEnum, RoleEnum } from "briar-shared"
import ConversationContext from "../../context/conversation"
import Messages from "../messages"
import { chatRequest } from "@/api/ai"
import { errorNotify } from "@/utils/notify"

import { useRequest } from "alova/client"
import useScroll from "../../hooks/useScroll"
import TextArea from "antd/es/input/TextArea"

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

  const createNewChat = () => {
    setCurrentConversationKey(undefined)
  }

  const { loading, send, abort } = useRequest(chatRequest, {
    immediate: false,
  })

  const { scrollToBottom } = useScroll(`.${s.Messages}`)

  const submit = async () => {
    if (!inputValue || loading) {
      return
    }

    const submitTime = Date.now()

    const submitMessage = {
      role: RoleEnum.User,
      content: inputValue,
      created: submitTime,
    }

    send({
      messages: (currentConversation?.messages || []).concat(submitMessage),
      model,
    })
      .then((data) => {
        const userMessage = {
          role: RoleEnum.User,
          content: inputValue,
          created: submitTime,
        }

        const assistantMessage = {
          role: RoleEnum.Assistant,
          content: data?.choices?.[0]?.message?.content || "",
          created: data?.created,
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

        scrollToBottom()
      })
      .catch((e) => {
        errorNotify(e)
      })
      .finally(() => {
        setInputValue("")
      })
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

  // 切会话了，手动取消当前请求
  useEffect(() => {
    abort()
  }, [currentConversation?.created])

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
          options={[{ value: ModelEnum.Gpt4oMini, label: "gpt-4o-mini" }]}
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
          autoSize
          onKeyDown={onTextAreaKeydown}
        />
        <Button
          icon={<ArrowUpOutlined />}
          onClick={submit}
          loading={loading}
          className={s.SubmitBtn}
          shape="circle"
        ></Button>
      </div>
    </div>
  )
}

export default Conversation
