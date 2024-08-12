import { IConversation, ModelEnum, RoleEnum } from "briar-shared"
import { CONVERSATION_DESC, ConversationEnum } from "../constants"
import { useEffect, useMemo, useState } from "react"
import { isAfter, isBefore, subDays } from "date-fns"
import { IMenuRouterConfig } from "@/types/router"
import { FormOutlined } from "@ant-design/icons"

const useConversationList = () => {
  const [conversationList, setConversationList] = useState<IConversation[]>([])
  const [currentConversationKey, setCurrentConversationKey] = useState<string>()
  const now = Date.now()

  const clickMenuItem = (key: string) => {
    setCurrentConversationKey(key)
  }

  const init = () => {
    setConversationList([
      {
        model: ModelEnum.Gpt4oMini,
        created: Date.now(),
        messages: [
          {
            role: RoleEnum.User,
            content: "Who won the world series in 2020?",
            created: Date.now() - 1,
          },
          {
            role: RoleEnum.Assistant,
            content:
              "The Los Angeles Dodgers won the World Series in 2020.The 2020 World Series was played in Texas at Globe Life Field in Arlington.\nThe 2020 World Series was played in Texas at Globe Life Field in Arlington.",
            created: Date.now(),
          },
        ],
      },
    ])
  }

  const updateConversation = (conversation: IConversation) => {
    setConversationList([
      conversation,
      ...conversationList.filter(({ created }) => {
        return created !== conversation.created
      }),
    ])
    setCurrentConversationKey(conversation.created.toString())
  }

  const addConversation = (conversation: IConversation) => {
    setConversationList([conversation, ...conversationList])
    setCurrentConversationKey(conversation.created.toString())
  }

  const deleteConversation = (conversation: IConversation) => {}

  const currentConversation: IConversation | undefined = useMemo(() => {
    if (!currentConversationKey) {
      return
    }
    return conversationList.find(({ created }) => {
      return created === +currentConversationKey
    })
  }, [conversationList, currentConversationKey])

  const menuConfig = useMemo((): IMenuRouterConfig[] => {
    const normalizeConversationList = (during: [number, number]) => {
      const [minAgo, maxAgo] = during

      return conversationList
        .filter(({ created }) => {
          return isAfter(created, subDays(now, maxAgo).getTime()) && minAgo
            ? isBefore(created, subDays(now, minAgo))
            : true
        })
        .map((conversation) => {
          const { created, messages } = conversation
          return {
            ...conversation,
            key: created.toString(),
            label: messages?.[0].content,
          }
        })
    }

    const latestConversations = normalizeConversationList([0, 1])
    const duringPast3DaysConversations = normalizeConversationList([1, 3])
    const duringPastWeekConversations = normalizeConversationList([3, 7])
    const duringPastMonthConversations = normalizeConversationList([7, 30])

    return [
      {
        key: ConversationEnum.Latest,
        label: CONVERSATION_DESC[ConversationEnum.Latest],
        type: "group",
        children: latestConversations,
      },
      {
        key: ConversationEnum.DuringPast3Days,
        label: CONVERSATION_DESC[ConversationEnum.DuringPast3Days],
        type: "group",
        children: duringPast3DaysConversations,
      },
      {
        key: ConversationEnum.DuringPastWeek,
        label: CONVERSATION_DESC[ConversationEnum.DuringPastWeek],
        type: "group",
        children: duringPastWeekConversations,
      },
      {
        key: ConversationEnum.DuringPastMonth,
        label: CONVERSATION_DESC[ConversationEnum.DuringPastMonth],
        type: "group",
        children: duringPastMonthConversations,
      },
    ].filter((item) => item.children.length > 0)
  }, [conversationList, now])

  useEffect(() => {
    init()
  }, [])

  return {
    menuConfig,
    currentConversationKey,
    clickMenuItem,
    currentConversation,
    updateConversation,
    addConversation,
    setCurrentConversationKey,
    // model,
    // setModel
  }
}

export default useConversationList
