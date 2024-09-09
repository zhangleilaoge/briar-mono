import { Button, Popover, Radio, Select } from 'antd';
import s from './style.module.scss';
import { ArrowUpOutlined, FormOutlined, XFilled } from '@ant-design/icons';
import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { RoleEnum } from 'briar-shared';
import ConversationContext from '../../context/conversation';
import Messages from '../messages';
import { chatRequestStream, createMessage, updateMessage } from '@/api/ai';

import { useSSE } from 'alova/client';
import useScroll from '../../hooks/useScroll';
import TextArea from 'antd/es/input/TextArea';
import { SSEHookReadyState } from '../../constants';
import useGptModel from './hooks/useGptModel';
import mainStyle from '@/styles/main.module.scss';
import useCompositionInput from './hooks/useCompositionInput';

const Conversation: FC = () => {
	const [inputValue, setInputValue] = useState('');
	const {
		createConversation,
		setCurrentConversationKey,
		currentConversation,
		setMessageArr,
		messageArr
	} = useContext(ConversationContext);
	const assistantAnswerRef = useRef('');
	const readyForNewChat = () => {
		setCurrentConversationKey(undefined);
		setMessageArr([]);
	};
	const { selectOption, options, onChange } = useGptModel();
	const { onMessage, send, close, readyState } = useSSE(chatRequestStream);
	const loading = useMemo(() => {
		return (readyState as number) !== SSEHookReadyState.CLOSED;
	}, [readyState]);
	const { scrollToBottom } = useScroll(`.${s.Messages}`);
	const { handleComposition, isCompositionRef } = useCompositionInput();

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

	// 询问发出时，创建对话以及创建用户消息和助手消息
	const submit = async () => {
		if (!inputValue || loading) {
			shutDown();
			return;
		}

		const conversation = currentConversation || (await createConversation(inputValue))!;
		setCurrentConversationKey(conversation.id);
		const userMsg = await createMessage({
			content: inputValue,
			role: RoleEnum.User,
			model: selectOption.value,
			conversationId: conversation.id
		});
		const assistantMsg = await createMessage({
			content: assistantAnswerRef.current,
			role: RoleEnum.Assistant,
			model: selectOption.value,
			conversationId: conversation.id
		});

		setMessageArr([...messageArr, userMsg, assistantMsg]);

		send({
			query: inputValue,
			model: selectOption.value,
			conversationId: conversation?.id
		});

		setInputValue('');
		scrollToBottom();
	};

	const textareaPlaceholder = useMemo(() => {
		if (!currentConversation) {
			return '输入聊天内容，开启新的对话。';
		}

		return '继续输入内容以获取回答。';
	}, [currentConversation]);

	const onTextAreaKeydown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === 'Enter' && !e.shiftKey && !isCompositionRef.current) {
			e.preventDefault();
			submit();
		}
	};

	const shutDown = async () => {
		close();
		assistantAnswerRef.current = '';
		setInputValue('');
		scrollToBottom();
	};

	// 请求完成后，更新助手消息
	useEffect(() => {
		if (!loading) {
			const content = assistantAnswerRef.current || '请求超时,请稍后重试。';

			if (messageArr.length && messageArr[messageArr.length - 1].role === RoleEnum.Assistant) {
				updateMessage({
					content,
					id: messageArr[messageArr.length - 1].id
				}).then(() => {
					setMessageArr([
						...messageArr.slice(0, -1),
						{
							...messageArr[messageArr.length - 1],
							content
						}
					]);
				});
			}

			shutDown();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loading]);

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

	return (
		<div className={s.Container}>
			<div className={s.Head}>
				<Popover content="创建新对话">
					<Radio.Group value={!currentConversation}>
						<Radio.Button onClick={readyForNewChat} value={true}>
							<FormOutlined />
						</Radio.Button>
					</Radio.Group>
				</Popover>
				<Select
					value={selectOption.value}
					style={{ width: 120 }}
					onChange={onChange}
					options={options}
				/>
			</div>
			<div className={`${s.Messages} ${loading ? mainStyle.loadingCursor : ''}`}>
				<Messages conversation={currentConversation} loading={loading} />
			</div>
			<div className={s.Input}>
				<TextArea
					placeholder={textareaPlaceholder}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					size="large"
					autoSize={{ minRows: 1, maxRows: 6 }}
					onKeyDown={onTextAreaKeydown}
					// @ts-ignore
					onCompositionStart={handleComposition}
					// @ts-ignore
					onCompositionEnd={handleComposition}
					maxLength={500}
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
	);
};

export default Conversation;
