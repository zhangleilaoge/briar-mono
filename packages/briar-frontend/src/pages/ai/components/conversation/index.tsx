import { Button, Popover, Radio, Select } from "antd"
import s from "./style.module.scss"
import { ArrowUpOutlined, FormOutlined } from "@ant-design/icons"
import { FC, useContext, useEffect, useState } from "react"
import { IConversation, ModelEnum, RoleEnum } from "briar-shared"
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
  const [conversation, setConversation] = useState<IConversation>()
  const [inputValue, setInputValue] = useState("")
  const {
    updateConversation,
    addConversation,
    setCurrentConversationKey,
    currentConversation,
  } = useContext(ConversationContext)

  const createNewChat = () => {
    setConversation(undefined)
    setCurrentConversationKey(undefined)
  }

  const { loading, send } = useRequest(chatRequest, {
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
      messages: (conversation?.messages || []).concat(submitMessage),
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

        if (conversation) {
          updateConversation({
            ...conversation,
            messages: [...conversation.messages, userMessage, assistantMessage],
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

  useEffect(() => {
    if (currentConversation) {
      setConversation(currentConversation)
    }
  }, [currentConversation])

  return (
    <div className={s.Container}>
      <div className={s.Head}>
        <Popover content="创建新对话">
          <Radio.Group value={!conversation}>
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
        <Messages conversation={conversation} />
      </div>
      <div className={s.Input}>
        <TextArea
          placeholder="输入内容以获取回答。"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          size="large"
          autoSize
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submit()}
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
