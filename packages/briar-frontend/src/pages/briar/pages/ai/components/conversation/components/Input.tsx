import { ArrowUpOutlined, PaperClipOutlined, XFilled } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useMemo } from 'react';
import React from 'react';

import useUploadImg from '@/pages/briar/hooks/biz/useUploadImg';
import { useContainer } from '@/pages/briar/hooks/useContainer';

import { conversationContainer } from '../../../container/conversationContainer';
import useCompositionInput from '../hooks/useCompositionInput';
import s from '../style.module.scss';

interface IInputProps {
	loading: boolean;
	inputValue: string;
	setInputValue: (value: string) => void;
	submit: () => void;
	uploading: boolean;
	uploadList: ReturnType<typeof useUploadImg>['uploadList'];
	setUploadList: ReturnType<typeof useUploadImg>['setUploadList'];
	uploadKey: ReturnType<typeof useUploadImg>['uploadKey'];
	customRequest: ReturnType<typeof useUploadImg>['customRequest'];
}

const Input = ({
	loading,
	inputValue,
	uploading,
	setInputValue,
	submit,
	customRequest,
	setUploadList,
	uploadKey,
	uploadList
}: IInputProps) => {
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

	const maxRows = useMemo(() => {
		if (uploadList.length) {
			return 1;
		}
		return 6;
	}, [uploadList.length]);

	return (
		<div className={s.Input}>
			<TextArea
				placeholder={textareaPlaceholder}
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				size="large"
				autoSize={{ minRows: 1, maxRows }}
				onKeyDown={onTextAreaKeydown}
				// @ts-ignore
				onCompositionStart={handleComposition}
				// @ts-ignore
				onCompositionEnd={handleComposition}
				maxLength={1900}
				disabled={loading}
				className="z-10"
			/>
			<Upload
				accept="image/*"
				customRequest={customRequest}
				showUploadList={{
					showPreviewIcon: false
				}}
				maxCount={1}
				listType="picture"
				className={`${s.upload} absolute left-[0] bottom-[8px] flex flex-col-reverse gap-[18px]`}
				onRemove={(file) => {
					setUploadList((pre) => pre.filter((item) => item.name.indexOf(file.name) === -1));
				}}
				key={uploadKey}
			>
				<Button
					icon={<PaperClipOutlined />}
					className="ml-[9px] z-20"
					onClick={() => {}}
					shape="circle"
					disabled={loading || uploading}
				></Button>
			</Upload>
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
