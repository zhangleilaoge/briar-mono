import { CheckCircleFilled, CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, message, Popconfirm, Skeleton, Tooltip } from 'antd';
import { RoleEnum, StardewValleyGirl } from 'briar-shared';
import { format } from 'date-fns';
import { FC, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import { STARDEW_VALLEY_GRIL } from '@/pages/briar/constants/img';
import { useContainer } from '@/pages/briar/hooks/useContainer';
import { copyToClipboard } from '@/pages/briar/utils/document';

import { conversationContainer } from '../../container/conversationContainer';
import s from './style.module.scss';

interface IMessageProps {
	content: string;
	role: RoleEnum;
	date: number;
	imgList?: string[];
	editPrompt?: string;
}

const CopyBtn = ({ content }: { content: string }) => {
	const [copied, setCopied] = useState(false);

	return (
		<Button
			type="text"
			className={s.CopyBtn}
			icon={copied ? <CheckCircleFilled /> : <CopyOutlined />}
			onClick={async () => {
				await copyToClipboard(content);
				message.success('复制成功');
				setCopied(true);
			}}
			onMouseLeave={() => {
				setTimeout(() => {
					setCopied(false);
				}, 5000);
			}}
		></Button>
	);
};

const AssistantProfile = () => {
	const { currentConversation, updateConversation } = useContainer(conversationContainer);
	const [value, setValue] = useState(currentConversation?.prompt);
	const assistantProfile = useMemo(() => {
		return (
			STARDEW_VALLEY_GRIL[currentConversation?.profile as StardewValleyGirl] ||
			STARDEW_VALLEY_GRIL[StardewValleyGirl.Abigail]
		);
	}, [currentConversation?.profile]);

	const desc = useMemo(() => {
		return (
			<>
				<div className="mb-[12px]">编辑提示语：</div>
				<Input.TextArea
					rows={4}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className="mb-[10px]"
				/>
			</>
		);
	}, [value]);

	const onConfirm = () => {
		if (value) {
			updateConversation({
				...currentConversation!,
				prompt: value
			}).then(() => {
				message.success('提示语更新成功');
			});
		}
	};

	useEffect(() => {
		setValue(currentConversation?.prompt);
	}, [currentConversation?.prompt]);

	return (
		<Popconfirm
			icon=""
			title=""
			placement="topLeft"
			description={desc}
			okText="确定"
			cancelText="取消"
			onConfirm={onConfirm}
			className="cursor-pointer"
		>
			<Avatar size={54} src={assistantProfile} />
		</Popconfirm>
	);
};

const Img = ({ url }: { url: string }) => {
	const [loadStatus, setLoadStatus] = useState(false);
	const [loadError, setLoadError] = useState(false);

	if (loadError) {
		return <Skeleton.Node>图片已失效</Skeleton.Node>;
	}

	return (
		<>
			{!loadStatus && <Skeleton.Image active key={url} className={s.Img} />}
			<img
				src={url}
				alt="img"
				className={`${s.Img} ${loadStatus ? '' : s.HideImg}`}
				onLoad={() => {
					setLoadStatus(true);
				}}
				onError={() => {
					setLoadError(true);
				}}
			/>
		</>
	);
};

const Message: FC<IMessageProps> = ({ content, role, date, imgList }) => {
	const isUser = role === RoleEnum.User;

	// 复制代码功能
	useEffect(() => {
		const codeBlocks = document.querySelectorAll(`pre`);

		codeBlocks.forEach((block) => {
			let button = block.querySelector(`.${s.CopyButton}`);
			if (button) {
				return;
			}
			button = document.createElement('div');
			button.className = s.CopyButton;

			// eslint-disable-next-line react/no-deprecated
			ReactDOM.render(<CopyBtn content={block.textContent || ''} />, button);

			block.appendChild(button);
		});

		return () => {
			codeBlocks.forEach((block) => {
				const button = block.querySelector(`.${s.CopyButton}`);
				if (button) {
					block.removeChild(button);
				}
			});
		};
	}, [content]);

	return (
		<div className={`${s.Message} ${isUser ? s.User : s.Assistant}`}>
			{!isUser && <AssistantProfile />}
			<div>
				<div className={s.Date}>{format(date, 'yyyy-MM-dd HH:mm:ss')}</div>
				<div className={`${s.ContentArea}`}>
					<div className={`${s.Content}`}>
						{isUser ? (
							content || ''
						) : (
							<Markdown rehypePlugins={[rehypeHighlight, remarkGfm]}>{content || ' '}</Markdown>
						)}
						{imgList?.map?.((url) => {
							return <Img url={url} key={url} />;
						})}
					</div>
					{imgList?.length && !isUser ? (
						<div className={s.ImgTip}>
							<Tooltip
								placement={isUser ? 'left' : 'right'}
								title="Please ensure that image materials are saved promptly, as generated results will be retained for a maximum of one hour."
							>
								<InfoCircleOutlined />
							</Tooltip>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default Message;
