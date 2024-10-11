import { ArrowUpOutlined, XFilled } from '@ant-design/icons';
import { Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useMemo } from 'react';
import React from 'react';

import { useContainer } from '@/pages/briar/hooks/useContainer';

import { conversationContainer } from '../../../container/conversationContainer';
import useCompositionInput from '../hooks/useCompositionInput';
import s from '../style.module.scss';

interface IInputProps {
	loading: boolean;
	inputValue: string;
	setInputValue: (value: string) => void;
	submit: () => void;
}

const Input = ({ loading, inputValue, setInputValue, submit }: IInputProps) => {
	const { currentConversation } = useContainer(conversationContainer);
	const { handleComposition, isCompositionRef } = useCompositionInput();

	const textareaPlaceholder = useMemo(() => {
		if (loading) {
			return '回答生成中...';
		}

		if (!currentConversation) {
			return '输入聊天内容，开启新的对话。';
		}

		return '继续输入内容以获取回答。';
	}, [currentConversation, loading]);

	const onTextAreaKeydown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === 'Enter' && !e.shiftKey && !isCompositionRef.current) {
			e.preventDefault();
			submit();
		}
	};

	return (
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
				maxLength={1900}
				disabled={loading}
			/>
			<Button
				icon={loading ? <XFilled /> : <ArrowUpOutlined />}
				onClick={submit}
				className={s.SubmitBtn}
				shape="circle"
				danger={loading}
			></Button>
		</div>
	);
};

export default Input;
