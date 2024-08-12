import { Button, Input, Popover, Radio, Select, Space } from "antd"
import s from "./style.module.scss"
import { ArrowUpOutlined, FormOutlined } from "@ant-design/icons"
import { FC, useContext, useEffect, useState } from "react"
import { IConversation, ModelEnum, RoleEnum } from "briar-shared"
import ConversationContext from "../../context/conversation"
import Messages from "../messages"
import { chatRequest } from "@/api/ai"
import { onError } from "@/utils/notify"

interface IProps {}

const Conversation: FC<IProps> = (props) => {
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

  const submit = async () => {
    if (!inputValue) {
      return
    }

    const submitTime = Date.now()

    // const data = await Promise.resolve({
    //   choices: [
    //     {
    //       finish_reason: "stop",
    //       index: 0,
    //       message: {
    //         content:
    //           "The 2020 World Series was played in Texas at Globe Life Field in Arlington.",
    //         role: "assistant",
    //       },
    //       logprobs: null,
    //     },
    //   ],
    //   created: Math.random() * 99999,
    //   id: "chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW",
    //   model: "gpt-4o-mini",
    //   object: "chat.completion",
    //   usage: {
    //     completion_tokens: 17,
    //     prompt_tokens: 57,
    //     total_tokens: 74,
    //   },
    // })

    chatRequest({
      messages: conversation?.messages || [],
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
          content: data?.choices?.[0]?.message?.content,
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
      })
      .catch((e) => {
        onError(e)
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
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="输入内容以获取回答。"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            size="large"
            onPressEnter={submit}
          />
          <Button
            icon={<ArrowUpOutlined />}
            size="large"
            onClick={submit}
          ></Button>
        </Space.Compact>
      </div>
    </div>
  )
}

export default Conversation
