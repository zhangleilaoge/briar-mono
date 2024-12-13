import { useRequest, useSSE } from 'alova/client';
import { Button } from 'antd';
import { RoleEnum } from 'briar-shared';
import cx from 'classnames';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { chatRequestStream, createMessage, genImg, updateMessage } from '@/pages/briar/api/ai';
import useUploadImg from '@/pages/briar/hooks/biz/useUploadImg';
import { useContainer } from '@/pages/briar/hooks/useContainer';
import mainStyle from '@/pages/briar/styles/main.module.scss';
import { errorNotify } from '@/pages/briar/utils/notify';

import { SSEHookReadyState } from '../../constants';
import { conversationContainer } from '../../container/conversationContainer';
import useScroll from '../../hooks/useScroll';
import Messages from '../messages';
import ConversationOpt from './components/ConversationOpt';
import Input from './components/Input';
import useGptModel from './hooks/useGptModel';
import s from './style.module.scss';
const Conversation: FC = () => {
	const [inputValue, setInputValue] = useState('');

	const {
		messageArr,
		createImgMode,
		currentConversation,
		hasMoreMessages,
		createConversation,
		loadMoreMessages,
		setCurrentConversationKey,
		setMessageArr,
		refreshConversationList,
		setCreateImgMode
	} = useContainer(conversationContainer);
	const assistantAnswerRef = useRef('');
	// 加载更多状态
	const [fetching, setFetching] = useState(false);
	const { selectOption, options, onChange } = useGptModel();
	const { onMessage, send, close, readyState } = useSSE(chatRequestStream);
	const {
		send: createImg,
		onSuccess: onSuccessCreateImg,
		onError: onErrorCreateImg,
		loading: loadingCreateImg
	} = useRequest(genImg, {
		immediate: false
	});
	const { send: updateMsg, onSuccess: onSuccessUpdateMsg } = useRequest(updateMessage, {
		immediate: false
	});
	const {
		uploadList,
		loading: uploading,
		uploadKey,
		setUploadList,
		customRequest,
		resetUploadKey
	} = useUploadImg();

	const queryLoading = useMemo(() => {
		return (readyState as number) !== SSEHookReadyState.CLOSED;
	}, [readyState]);
	const loading = useMemo(() => {
		return queryLoading || loadingCreateImg;
	}, [loadingCreateImg, queryLoading]);
	const { scrollToBottom, quickScrollToTop } = useScroll(`.${s.Messages}`);

	// 现在 sse 的 error 太弱了，没有任何提示作用，先注释了
	// onError((e) => {
	//   console.log(e)
	// })

	// sse 更新消息
	onMessage(async ({ data }) => {
		if (!currentConversation) return;

		assistantAnswerRef.current = `${assistantAnswerRef.current}${data}`;
		const isAssistantEnd = messageArr[messageArr.length - 1].role === RoleEnum.Assistant;
		if (isAssistantEnd) {
			setMessageArr(
				messageArr.map((message, index) => {
					if (index === messageArr.length - 1) {
						return {
							...message,
							content: assistantAnswerRef.current
						};
					}
					return message;
				})
			);
		}

		scrollToBottom();
	});

	onSuccessCreateImg(({ data }) => {
		const { imgList } = data;

		updateMsg({
			id: messageArr[messageArr.length - 1].id,
			imgList: JSON.stringify(imgList)
		});
	});

	onErrorCreateImg((e) => {
		errorNotify(e, {
			prefix: '图片生成错误：'
		});
	});

	onSuccessUpdateMsg(({ args }) => {
		setMessageArr([
			...messageArr.slice(0, -1),
			{
				...messageArr[messageArr.length - 1],
				...args[0]
			}
		]);
	});

	// 询问发出时，创建对话以及创建用户消息和助手消息
	const submit = async () => {
		if (!inputValue || loading) {
			shutDown();
			return;
		}

		const isNewConversation = !currentConversation;
		const conversation = currentConversation || (await createConversation(inputValue))!;
		const imgList = uploadList?.[0]?.url ? [uploadList?.[0]?.url] : [];

		setCurrentConversationKey(conversation.id);

		isNewConversation && refreshConversationList();

		const userMsg = await createMessage({
			content: inputValue,
			role: RoleEnum.User,
			model: selectOption.value,
			conversationId: conversation.id,
			imgList: imgList
		});
		const assistantMsg = await createMessage({
			content: assistantAnswerRef.current,
			role: RoleEnum.Assistant,
			model: selectOption.value,
			conversationId: conversation.id
		});

		setMessageArr([...messageArr, userMsg, assistantMsg]);
		setInputValue('');
		scrollToBottom();

		if (createImgMode) {
			createImg({
				content: inputValue
			});
			setCreateImgMode(false);
		} else {
			send({
				query: inputValue,
				model: selectOption.value,
				conversationId: conversation?.id,
				imgList
			});
		}

		setUploadList([]);
		resetUploadKey();
	};

	const loadMore = async () => {
		setFetching(true);
		loadMoreMessages().finally(() => {
			setFetching(false);
		});
	};

	const shutDown = async () => {
		close();
		setInputValue('');
	};

	// 请求完成后，更新助手消息
	useEffect(() => {
		if (!queryLoading) {
			const content = assistantAnswerRef.current;
			assistantAnswerRef.current = '';

			if (messageArr.length && messageArr[messageArr.length - 1].role === RoleEnum.Assistant) {
				updateMsg({
					content,
					id: messageArr[messageArr.length - 1].id
				});
			}

			shutDown();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryLoading]);

	// 切换对话，停止先前的消息流
	useEffect(() => {
		if (
			!currentConversation?.id ||
			(messageArr.length && messageArr[0].conversationId !== currentConversation?.id)
		) {
			shutDown();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentConversation?.id]);

	// 切换对话，新对话加载完成时，滚动到底部
	useEffect(() => {
		if (!messageArr?.[0]?.conversationId) return;
		quickScrollToTop();
		scrollToBottom();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messageArr?.[0]?.conversationId]);

	return (
		<div className={s.Container}>
			<div className={s.Head}>
				<ConversationOpt selectOption={selectOption} onChange={onChange} options={options} />
			</div>
			<div className={cx(s.Messages, { [mainStyle.loadingCursor]: loading })}>
				{hasMoreMessages ? (
					<div className={s.loadMore}>
						<Button
							type="text"
							onClick={loadMore}
							loading={fetching}
							disabled={loading || fetching}
						>
							加载更多
						</Button>
					</div>
				) : null}
				<Messages loading={loading} />
			</div>
			<Input
				uploadList={uploadList}
				loading={loading}
				inputValue={inputValue}
				setInputValue={setInputValue}
				submit={submit}
				uploading={uploading}
				setUploadList={setUploadList}
				customRequest={customRequest}
				uploadKey={uploadKey}
			/>
		</div>
	);
};

export default Conversation;
