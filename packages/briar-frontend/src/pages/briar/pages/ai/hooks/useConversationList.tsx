import { IConversationDTO, IMessageDTO } from 'briar-shared';
import { isAfter, isBefore, subDays } from 'date-fns';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
	createConversation as createConversationApi,
	deleteConversation as deleteConversationApi,
	getConversationList,
	getMessages,
	updateConversation as updateConversationApi
} from '@/pages/briar/api/ai';
import CommonContext from '@/pages/briar/context/common';
import { IMenuRouterConfig } from '@/pages/briar/types/router';

import { MenuItem } from '../components/menu-item';
import { CONVERSATION_DESC, ConversationEnum } from '../constants';

const initTime = Date.now();
const MESSAGE_PAGE_SIZE = 20;

const useConversationList = () => {
	const [conversationList, setConversationList] = useState<IConversationDTO[]>([]);
	const [messageArr, setMessageArr] = useState<IMessageDTO[]>([]);
	const [hasMoreMessages, setHasMoreMessages] = useState(false);
	const [currentConversationKey, setCurrentConversationKey] = useState<number>();
	const [selectedConversationKeys, setSelectedConversationKeys] = useState<number[]>([]);
	const [multiSelectMode, setMultiSelectMode] = useState(false);
	const [createImgMode, setCreateImgMode] = useState(false);
	const { userInfo } = useContext(CommonContext);

	const inMultiSelectMode = useCallback(() => {
		setMultiSelectMode(true);
	}, []);

	const outMultiSelectMode = useCallback(() => {
		setMultiSelectMode(false);
		setSelectedConversationKeys([]);
	}, []);

	const clickMenuItem = (key: number) => {
		setCurrentConversationKey(key);
		getMessages({
			conversationId: key,
			pageSize: MESSAGE_PAGE_SIZE
		}).then(({ items }) => {
			setHasMoreMessages(MESSAGE_PAGE_SIZE <= items.length);
			setMessageArr(items);
		});
	};

	const loadMoreMessages = useCallback(async () => {
		const { items: messages } = await getMessages({
			conversationId: currentConversationKey as number,
			endTime: new Date(messageArr[0].createdAt).getTime(),
			pageSize: MESSAGE_PAGE_SIZE
		});
		setHasMoreMessages(MESSAGE_PAGE_SIZE <= messages.length);
		setMessageArr([...messages, ...messageArr]);
	}, [currentConversationKey, messageArr]);

	const refreshConversationList = async () => {
		const list = await getConversationList();
		setConversationList(list);
	};

	const createConversation = async (title: string) => {
		const conversation = await createConversationApi({
			title
		});

		setConversationList([conversation, ...conversationList]);
		setCurrentConversationKey(conversation.id);

		return conversation;
	};

	const updateConversation = useCallback((conversation: IConversationDTO) => {
		updateConversationApi(conversation).then(() => {
			refreshConversationList();
		});
	}, []);

	const deleteConversation = useCallback(
		async (id: number) => {
			await deleteConversationApi({ ids: [id] });
			refreshConversationList();

			setMessageArr([]);
			if (currentConversationKey === id) {
				setCurrentConversationKey(undefined);
			}
		},
		[currentConversationKey]
	);

	const deleteSelectedConversation = useCallback(async () => {
		await deleteConversationApi({ ids: selectedConversationKeys });
		setSelectedConversationKeys([]);
		setMultiSelectMode(false);
		refreshConversationList();

		setMessageArr([]);
		if (selectedConversationKeys.includes(currentConversationKey || 0)) {
			setCurrentConversationKey(undefined);
		}
	}, [currentConversationKey, selectedConversationKeys]);

	const currentConversation: IConversationDTO | undefined = useMemo(() => {
		if (!currentConversationKey) {
			return;
		}
		return conversationList.find(({ id }) => {
			return id === +currentConversationKey;
		});
	}, [conversationList, currentConversationKey]);

	const menuConfig = useMemo((): IMenuRouterConfig[] => {
		const normalizeConversationList = (during: [number, number]) => {
			const [minAgo, maxAgo] = during;
			const start = subDays(initTime, maxAgo).getTime();
			// 避免时区问题，当 minAgo 为 0 时，将 end 适当延后
			const end = minAgo ? subDays(initTime, minAgo).getTime() : Date.now() + 1000 * 60 * 60 * 24;

			return conversationList
				.filter(({ createdAt }) => {
					return isAfter(createdAt, start) && isBefore(createdAt, end);
				})
				.map((conversation) => {
					const { id } = conversation;
					return {
						key: `${id}`,
						label: (
							<MenuItem
								conversation={conversation}
								deleteConversation={deleteConversation}
								updateConversation={updateConversation}
							/>
						)
					};
				});
		};

		const latestConversations = normalizeConversationList([0, 1]);
		const duringPast3DaysConversations = normalizeConversationList([1, 3]);
		const duringPastWeekConversations = normalizeConversationList([3, 7]);
		const duringPastMonthConversations = normalizeConversationList([7, 30]);

		return [
			{
				key: ConversationEnum.Latest,
				label: CONVERSATION_DESC[ConversationEnum.Latest],
				type: 'group',
				children: latestConversations
			},
			{
				key: ConversationEnum.DuringPast3Days,
				label: CONVERSATION_DESC[ConversationEnum.DuringPast3Days],
				type: 'group',
				children: duringPast3DaysConversations
			},
			{
				key: ConversationEnum.DuringPastWeek,
				label: CONVERSATION_DESC[ConversationEnum.DuringPastWeek],
				type: 'group',
				children: duringPastWeekConversations
			},
			{
				key: ConversationEnum.DuringPastMonth,
				label: CONVERSATION_DESC[ConversationEnum.DuringPastMonth],
				type: 'group',
				children: duringPastMonthConversations
			}
		].filter((item) => item.children.length > 0);
	}, [conversationList, deleteConversation, updateConversation]);

	useEffect(() => {
		userInfo.id && refreshConversationList();
	}, [userInfo.id]);

	return {
		createImgMode,
		menuConfig,
		currentConversationKey,
		currentConversation,
		multiSelectMode,
		selectedConversationKeys,
		messageArr,
		hasMoreMessages,
		createConversation,
		setCurrentConversationKey,
		deleteSelectedConversation,
		inMultiSelectMode,
		outMultiSelectMode,
		setSelectedConversationKeys,
		setMessageArr,
		clickMenuItem,
		updateConversation,
		refreshConversationList,
		setCreateImgMode,
		loadMoreMessages
	};
};

export default useConversationList;
