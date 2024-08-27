import { IConversation, safeJsonParse } from "briar-shared"
import {
  CONVERSATION_DESC,
  ConversationEnum,
  MAX_CONVERSATION_NUM,
} from "../constants"
import { useCallback, useEffect, useMemo, useState } from "react"
import { isAfter, isBefore, subDays } from "date-fns"
import { IMenuRouterConfig } from "@/types/router"
import { LocalStorageKey } from "@/constants/env"
import { MenuItem } from "../components/menu-item"

const useConversationList = () => {
  const [conversationList, setConversationList] = useState<IConversation[]>([])
  const [currentConversationKey, setCurrentConversationKey] = useState<string>()
  const [selectedConversationKeys, setSelectedConversationKeys] = useState<
    string[]
  >([])
  const [needUpdate, setNeedUpdate] = useState(false)
  const [multiSelectMode, setMultiSelectMode] = useState(false)

  const now = Date.now()

  const inMultiSelectMode = useCallback(() => {
    setMultiSelectMode(true)
  }, [])

  const outMultiSelectMode = useCallback(() => {
    setMultiSelectMode(false)
    setSelectedConversationKeys([])
  }, [])

  const clickMenuItem = (key: string) => {
    setCurrentConversationKey(key)
  }

  const init = () => {
    const list =
      safeJsonParse(localStorage.getItem(LocalStorageKey.Conversation) || "") ||
      []
    setConversationList(list)
  }

  const updateConversation = useCallback(
    (conversation: IConversation, updateToTop = true) => {
      setConversationList(
        updateToTop
          ? [
              conversation,
              ...conversationList.filter(({ created }) => {
                return created !== conversation.created
              }),
            ]
          : conversationList.map((item) => {
              return item.created === conversation.created ? conversation : item
            })
      )
      updateToTop && setCurrentConversationKey(conversation.created.toString())

      setNeedUpdate(true)
    },
    [conversationList]
  )

  const addConversation = (conversation: IConversation) => {
    setConversationList([conversation, ...conversationList])
    setCurrentConversationKey(conversation.created.toString())

    setNeedUpdate(true)
  }

  const deleteConversation = useCallback(
    (conversation?: IConversation) => {
      if (!conversation) {
        setConversationList([])
      } else {
        setConversationList(
          conversationList.filter(({ created }) => {
            return created !== conversation.created
          })
        )
      }
      setNeedUpdate(true)
    },
    [conversationList]
  )

  const deleteSelectedConversation = useCallback(() => {
    setConversationList(
      conversationList.filter(({ created }) => {
        return !selectedConversationKeys.includes(created.toString())
      })
    )
    setSelectedConversationKeys([])
    setMultiSelectMode(false)

    setNeedUpdate(true)
  }, [conversationList, selectedConversationKeys])

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
      const start = subDays(now, maxAgo).getTime()
      const end = subDays(now, minAgo).getTime()

      return conversationList
        .filter(({ created }) => {
          return isAfter(created, start) && isBefore(created, end)
        })
        .map((conversation) => {
          const { created } = conversation
          return {
            ...conversation,
            key: created.toString(),
            label: (
              <MenuItem
                conversation={conversation}
                deleteConversation={deleteConversation}
                updateConversation={updateConversation}
              />
            ),
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
  }, [conversationList, deleteConversation, now, updateConversation])

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (needUpdate) {
      localStorage.setItem(
        LocalStorageKey.Conversation,
        JSON.stringify(conversationList.slice(0, MAX_CONVERSATION_NUM))
      )

      setNeedUpdate(false)
    }
  }, [conversationList, needUpdate])

  return {
    menuConfig,
    currentConversationKey,
    clickMenuItem,
    currentConversation,
    updateConversation,
    addConversation,
    setCurrentConversationKey,
    deleteSelectedConversation,
    multiSelectMode,
    inMultiSelectMode,
    outMultiSelectMode,
    setSelectedConversationKeys,
    selectedConversationKeys,
  }
}

export default useConversationList
