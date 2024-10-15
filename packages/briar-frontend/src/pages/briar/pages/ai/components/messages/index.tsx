import 'highlight.js/styles/atom-one-dark.css';

import { CheckCircleFilled, CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, message, Skeleton, Tooltip } from 'antd';
import {
	getRandomGirl,
	IConversationDTO,
	RoleEnum,
	safeJsonParse,
	StardewValleyGirl
} from 'briar-shared';
import { format } from 'date-fns';
import { FC, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

import { STARDEW_VALLEY_GRIL } from '@/pages/briar/constants/img';
import { useContainer } from '@/pages/briar/hooks/useContainer';
import { copyToClipboard } from '@/pages/briar/utils/document';

import { conversationContainer } from '../../container/conversationContainer';
import useLoadingDesc from './hooks/useLoadingDesc';
import s from './style.module.scss';

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

const Message: FC<{
	content: string;
	role: RoleEnum;
	date: number;
	imgList?: string[];
	assistantProfile?: string;
}> = ({ content, role, date, imgList, assistantProfile }) => {
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
			{!isUser && <Avatar size={54} src={assistantProfile} />}
			<div>
				<div className={s.Date}>{format(date, 'yyyy-MM-dd HH:mm:ss')}</div>
				<div className={`${s.ContentArea}`}>
					<div className={`${s.Content}`}>
						{isUser ? (
							content || ''
						) : (
							<Markdown rehypePlugins={[rehypeHighlight]}>{content || ' '}</Markdown>
						)}
						{imgList?.map((url) => {
							return <Img url={url} key={url} />;
						})}
					</div>
					{imgList?.length ? (
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

const Messages: FC<{
	conversation?: IConversationDTO;
	loading?: boolean;
}> = ({ loading, conversation }) => {
	const { desc } = useLoadingDesc();
	const { messageArr } = useContainer(conversationContainer);
	const assistantProfile = useMemo(() => {
		return (
			STARDEW_VALLEY_GRIL[conversation?.profile as StardewValleyGirl] ||
			STARDEW_VALLEY_GRIL[getRandomGirl()]
		);
	}, [conversation]);

	return (
		<>
			{messageArr.map((message, index) => {
				const imgList = message.imgList ? safeJsonParse(message.imgList) : [];
				if (index === messageArr.length - 1 && loading && !message.content) {
					return (
						<Message
							key={message.id}
							content={desc}
							role={message.role}
							imgList={imgList}
							date={new Date(message.createdAt).getTime()}
							assistantProfile={assistantProfile}
						/>
					);
				}
				return (
					<Message
						key={message.id}
						content={message.content}
						role={message.role}
						imgList={imgList}
						date={new Date(message.createdAt).getTime()}
						assistantProfile={assistantProfile}
					/>
				);
			})}
		</>
	);
};

export default Messages;
