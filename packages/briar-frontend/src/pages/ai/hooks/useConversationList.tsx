import { IConversationDTO, IMessageDTO } from 'briar-shared';
import { CONVERSATION_DESC, ConversationEnum } from '../constants';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isAfter, isBefore, subDays } from 'date-fns';
import { IMenuRouterConfig } from '@/types/router';
import { MenuItem } from '../components/menu-item';
import {
	getConversationList,
	createConversation as createConversationApi,
	deleteConversation as deleteConversationApi,
	updateConversation as updateConversationApi,
	findMessagesByConversationId
} from '@/api/ai';
import CommonContext from '@/context/common';

const initTime = Date.now();

const useConversationList = () => {
	const [conversationList, setConversationList] = useState<IConversationDTO[]>([]);
	const [messageArr, setMessageArr] = useState<IMessageDTO[]>([]);
	const [currentConversationKey, setCurrentConversationKey] = useState<number>();
	const [selectedConversationKeys, setSelectedConversationKeys] = useState<number[]>([]);
	const [multiSelectMode, setMultiSelectMode] = useState(false);
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
		findMessagesByConversationId(key).then((data) => {
			setMessageArr(data);
		});
	};

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

	const deleteConversation = useCallback(async (id: number) => {
		await deleteConversationApi({ ids: [id] });
		refreshConversationList();
		setMessageArr([]);
	}, []);

	const deleteSelectedConversation = useCallback(async () => {
		await deleteConversationApi({ ids: selectedConversationKeys });
		setSelectedConversationKeys([]);
		setMultiSelectMode(false);
		refreshConversationList();
	}, [selectedConversationKeys]);

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
			const end = minAgo ? subDays(initTime, minAgo).getTime() : Date.now();

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
		menuConfig,
		currentConversationKey,
		currentConversation,
		multiSelectMode,
		selectedConversationKeys,
		messageArr,
		createConversation,
		setCurrentConversationKey,
		deleteSelectedConversation,
		inMultiSelectMode,
		outMultiSelectMode,
		setSelectedConversationKeys,
		setMessageArr,
		clickMenuItem,
		updateConversation
	};
};

export default useConversationList;
